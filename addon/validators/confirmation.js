import Ember from 'ember';
import BaseValidator from 'ember-validity/validators/base';

const {
  RSVP,
  isPresent
} = Ember;

export default BaseValidator.extend({

  defaultMessage: 'The values must match',

  eventRules() {
    return [
      { property: this.get('property'), validator: this },
      { property: this.get('options.confirm'), validator: this }
    ];
  },

  /**
   * Runs the validation against the value and returns
   * a Promise that either resolves if the validation passed
   * or rejects if the validation failed.
   *
   * @return {Promise} A Promise that resolves to the result of the validation
   */
  run() {
    const value = this.get('value');
    let attr = this.get('options.confirm');

    this._super();

    const confirmValue = this.get('model').get(attr);

    return new RSVP.Promise((resolve, reject)=> {
      if (isPresent(value) || isPresent(confirmValue)) {
        if (value !== confirmValue) {
          this.validationFailed();
          reject();
        } else {
          this.validationSucceeded();
          resolve();
        }
      } else {
        reject();
      }
    });
  }

});
