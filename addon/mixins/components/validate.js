import Ember from 'ember';
import DS from 'ember-data';

const { on, inject, isEmpty, Logger } = Ember;
const { keys } = Object;

export default Ember.Mixin.create({

  errors: DS.Errors.create(),

  validationState: 'pending',

  validator: inject.service(),

  validityPending: Ember.computed.equal('validationState', 'pending'),

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

  _updateState() {
    const validations = this.get('validations');
    const keys = Object.keys(validations);
    let state = 'pending',
        pass = 0;

    if (validations) {

      keys.forEach((key)=> {
        if (validations[key].state === 'pass') {
          pass++;
        } else if (validations[key].state === 'fail') {
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

  _validateOne(prop) {
    const rules = { [prop]: this.get(`validations.${prop}`) };
    this._validate(rules);
  },

  _validate(validations) {
    keys(validations).forEach((key)=> {
      let value;
      if (this.isGlimmerComponent) {
        value = this.attrs[validations[key].property];
      } else {
        value = this.get(validations[key].property);
      }
      validations[key].value = value;
    });

    return this.get('validator').validate(validations, this.get('errors'))['finally'](()=> {
      this._updateState();
    });
  }
});
