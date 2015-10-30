import Ember from 'ember';
import DS from 'ember-data';

const {
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
            validations[property] = {
              state: 'pending',
              validators: []
            };
          }

          validations[property].validators.push(validator);
        });
      } else { // The case where the value for the validator key is a string of a single property name
        if (isEmpty(validations[rules[type]])) {
          validations[rules[type]] = {
            state: 'pending',
            validators: []
          };
        }

        validations[rules[type]].validators.push(createValidator(validatorName, this, rules[type], {}));
      }

    });

    keys(events).forEach((eventName)=> {
      this.on(eventName, (event)=> {
        const validators = events[eventName].filter((tup)=> {
          return tup.property === event.target.name;
        }).map(tup => tup.validator);

        this._validate({ [event.target.name]: validators });
      });
    });

    this.set('validations', validations);
  },

  _updateState() {
    const validations = this.get('validations');
    let fullState = 'pending',
        fullPassCount = 0;

    keys(validations).forEach( key => {
      const validators = validations[key].validators;
      let state = 'pending',
          pass = 0;

      validators.forEach( validator => {
        const validatorState = validator.get('state');

        if (validatorState === 'fail') {
          state = 'fail';
          fullState = 'fail';
        } else if (validatorState === 'pass') {
          pass++;
        }
      });

      if (pass === validators.length) {
        state = 'pass';
        fullPassCount++;
      }

      this.set(`validations.${key}.state`, state);
    });

    if (fullPassCount === keys(validations).length) {
      fullState = 'pass';
    }

    this.set('validityState', fullState);
  },

  /**
   * Validates the properties described in the validations map and returns a Promise.
   *
   * @return {Promise} The promise that resolves the validation results
   */
  validate() {
    const validations = this.get('validations');

    // Reduces the property down to just an array of validators.
    const mappedValidations = keys(validations).reduce((result, property)=> {
      result[property] = validations[property].validators;

      return result;
    }, {});

    return this._validate(mappedValidations);
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
    })['finally'](()=> { this._updateState(); });
  }
});
