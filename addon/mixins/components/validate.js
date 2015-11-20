import Ember from 'ember';
import DS from 'ember-data';

const {
  defineProperty,
  on,
  isEmpty,
  Logger,
  computed,
  isArray,
  RSVP
} = Ember;

const { equal } = computed;

const { keys } = Object;

export default Ember.Mixin.create({

  validityState: 'pending',

  isValid: equal('validityState', 'pass'),
  isInvalid: equal('validityState', 'fail'),
  validationsPending: equal('validityState', 'pending'),

  /**
   * Sets up the validations and DOM events that trigger the validations.
   *
   * @method setUp
   * @private
   */
  _setup: on('init', function() {
    const rules = this.get('validations');

    let errors;
    if (this.isGlimmerComponent) {
      errors = this.get('attrs.errors');
    } else {
      errors = this.get('errors');
    }

    // Set up the errors object for this instance if needed
    if (isEmpty(errors) || !(errors instanceof DS.Errors)) {
      this.set('errors', DS.Errors.create());
    }

    if (isEmpty(rules)) {
      Logger.warn('No validation object was found.');
    } else {
      // convert and set the validators and events
      this.convertValidations(rules);
    }

  }),

  convertValidations(rules) {
    const types = keys(rules);
    const validations = {};
    const events = {};

    function createValidator(factoryName, model, property, options) {
      const validatorFactory = model.container.lookupFactory(factoryName);

      Ember.assert(`Validator with the name ${factoryName} was not found.`, Ember.isPresent(validatorFactory));

      const validator = validatorFactory.create();
      validator.setupProps(model, property, options, factoryName);

      return validator;
    }

    types.forEach((type)=> {
      if (type === 'on') {
        return;
      }

      const validatorName = `validator:${type}`;

      // TODO: review if we can use a cached validator. Seems like creating and destroying validators
      // per form is not that big of a deal. Even with a form with 100 form fields, how much memory
      // would this actually take?
      //
      // Use validator in cache or create a new one.
      // if (!this.container.cache[validatorName]) {
      //   this.container.registry.register(validatorName, this.container.lookupFactory(validatorName));
      // }


      // The case where the given value is an object with multiple properties to validate
      if (typeof rules[type] === 'object') {

        // handle multiple properties
        keys(rules[type]).forEach((property)=> {
          // Check if there are any user defined options to pass in
          const options = rules[type][property] === true ? {} : rules[type][property];
          const validator = createValidator(validatorName, this, property, options);

          // Add the to the event pool if required
          if (options.on) {
            if (isEmpty(events[options.on])) {
              events[options.on] = [];
            }

            let eventRules = validator.eventRules();
            eventRules = isArray(eventRules) ? eventRules : [eventRules];

            events[options.on].push(...eventRules);
          }

          // Add the validator
          if (isEmpty(validations[property])) {
            validations[property] = [];
          }

          validations[property].push(validator);
        });


      } else { // The case where the value for the validator key is a string of a single property name
        if (isEmpty(validations[rules[type]])) {
          validations[rules[type]] = [];
        }

        validations[rules[type]].push(createValidator(validatorName, this, rules[type], {}));
      }

    });

    keys(events).forEach((eventName)=> {
      this.on(eventName, (event)=> {
        const validators = events[eventName].filter((tup)=> {
          return tup.property === event.target.name;
        }).map(tup => tup.validator);

        if (validators.length) {
          this._validate({ [event.target.name]: validators });
        }
      });
    });

    this.set('validations', validations);

    this.defineComputedStates();
  },

  defineComputedStates() {
    const propList = keys(this.get('validations')).join(',');
    const propPath = `validations.{${propList}}`;

    defineProperty(this, 'validationStates', computed(`${propPath}.@each.state`, function() {
      const obj = {};

      keys(this.get('validations')).forEach(property => {
        const validators = this.get(`validations.${property}`);
        let state = 'pending';
        let passCount = 0;

        validators.forEach(validator => {
          switch (validator.get('state')) {
            case 'fail':
              state = 'fail';
              break;
            case 'pass':
              passCount++;
              break;
          }
        });

        if (passCount === validators.length) {
          state = 'pass';
        }

        obj[property] = state;
      });

      return obj;
    }));
  },

  /**
   * Validates the properties described in the validations map and returns a Promise.
   *
   * @return {Promise} The promise that resolves the validation results
   */
  validate() {
    return this._validate(this.get('validations'));
  },

  _validate(validations) {
    const promises = keys(validations).reduce((result, key)=> {

      // Clear the errors for each validator before running them.
      validations[key].forEach((validator)=> {
        this.get('errors').remove(validator.get('property'));
      });

      // Run the validators
      validations[key].forEach((validator)=> {
        result.push(validator.run());
      });

      return result;
    }, []);

    return RSVP.allSettled(promises).then((results)=> {
      let isValid = true;

      results.forEach((result)=> {
        if (result.state === 'rejected') {
          isValid = false;
        }
      });

      return isValid;
    });
  }
});
