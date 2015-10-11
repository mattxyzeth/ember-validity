import Ember from 'ember';
import DS from 'ember-data';

const {
  on,
  inject,
  isEmpty,
  Logger,
  computed
} = Ember;
const { keys } = Object;

export default Ember.Mixin.create({

  validationState: 'pending',

  validator: inject.service(),

  validityPending: computed.equal('validationState', 'pending'),

  validityValid: computed.equal('validationState', 'success'),

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
      this._registerValidationEvents(rules);

      // convert and set the validators
      this.set('validations', this.get('validator').convertValidations.call(this, rules));
    }

  }),

  /**
   * Loops over the rules for a validator type and if an `on` property is
   * found then register the event for validating the property.
   *
   * @method registerValidationEvents
   * @param {String} type The validator type
   * @param {Object} rules The object of rules to inspect
   * @private
   */
  _registerValidationEvents(rules) {
    const events = {};

    // handle global event listener
    if (rules.hasOwnProperty('on')) {
      this.on(rules.on, this.validate);
    }

    // Map all validators with events to arrays of keys
    keys(rules).forEach((validatorName)=> {
      if (typeof rules[validatorName] === 'object') {
        keys(rules[validatorName]).forEach((property)=> {
          const options = rules[validatorName][property];

          if (typeof options === 'object' && options.on) {
            if (isEmpty(events[options.on])) {
              events[options.on] = [];
            }

            events[options.on].push({ property, validator: validatorName });
          }
        });
      }
    });

    // Set up listeners for events
    keys(events).forEach((key)=> {
      this.on(key, (event)=> {
        this._validateWithEvent(event.target.name, events[key]);
      });
    });
  },

  _updateState() {
    const validations = this.get('validations');
    const keys = Object.keys(validations);
    let state = 'pending',
        pass = 0;

    if (validations) {

      keys.forEach((key)=> {
        if (validations[key].get('state') === 'pass') {
          pass++;
        } else if (validations[key].get('state') === 'fail') {
          state = 'fail';
        }
      });

      if (pass === keys.length) {
        state = 'pass';
      }

    }

    this.set('validationState', state);
  },

  /**
   * Validates the properties described in the validations map and returns a Promise.
   *
   * @return {Promise} The promise that resolves the validation results
   */
  validate() {
    return this._validate(this.get('validations'));
  },

  _validateWithEvent(property, keys) {
    const validatorNames = keys.filter(obj => obj.property === property).map(obj => obj.validator);
    const validators = this.get(`validations.${property}`).filter((validator)=> {
      return validatorNames.indexOf(validator.get('validatorName')) !== -1;
    });

    this._validate({ [property]: validators });
  },

  _validate(validations) {
    return this.get('validator').validate(validations, this.get('errors')); //['finally'](()=> {
      //this._updateState();
    //});
  }
});
