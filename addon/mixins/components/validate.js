import Ember from 'ember';
import ErrorDetection from 'validity/mixins/components/error-detection';
import DS from 'ember-data';

const { on, inject, isEmpty, Logger } = Ember;
const { keys } = Object;

const errors = new DS.Errors();

export default Ember.Mixin.create(ErrorDetection, {

  errors,

  validator: inject.service(),

  /**
   * Sets up the validations and DOM events that trigger the validations.
   *
   * @method setUp
   * @private
   */
  _setup: on('init', function() {
    const rules = this.get('validations');

    if (isEmpty(rules)) {
      Logger.warn('No validation object was found.');
    } else {

      // handle global event listener
      if (rules.hasOwnProperty('on')) {
        this.on(rules.on, this.validate);
      }

      // handle individual event listeners
      keys(rules).forEach((type)=> {
        if (typeof rules[type] === 'object') {
          this._registerValidationEvents(type, rules[type]);
        }
      });

      // convert and set the validators
      this.set('validations', this.get('validator').convertValidations(rules));
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
  _registerValidationEvents(type, rules) {
    const validationRules = this.get('validations');

    keys(rules).forEach((property)=> {
      const options = validationRules[type][property];

      if (typeof options === 'object' && options.hasOwnProperty('on')) {
        this.on(options.on, ()=> {
          this._validateOne(`${type}:${property}`);
        });
      }

    });
  },

  /**
   * Validates the properties described in the validations map and returns a Promise.
   *
   * @return {Promise} The promise that resolves the validation results
   */
  validate() {
    return this._validate(this.get('validations'));
  },

  _validateOne(prop) {
    const rules = { [prop]: this.get(`validations.${prop}`) };
    this._validate(rules);
  },

  _validate(validations) {
    keys(validations).forEach((key)=> {
      validations[key].value = this.get(validations[key].property);
    });

    return this.get('validator').validate(validations, this.get('errors'));
  }
});
