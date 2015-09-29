import Ember from 'ember';
import BaseValidator from 'validity/validators/base';

const { RSVP } = Ember;

export default BaseValidator.extend({

  defautlMessage: 'The values must match',

  /**
   * Runs the validation against the value and returns
   * a Promise that either resolves if the validation passed
   * or rejects if the validation failed.
   *
   * @return {Promise} A Promise that resolves to the result of the validation
   */
  run() {
    const value = this.get('value');
    const confirmValue = this.get('model').get(this.get('options').confirm);

    return new RSVP.Promise((resolve, reject)=> {
      if (value !== confirmValue) {
        reject([this.get('message')]);
      } else {
        resolve();
      }
    });
  }

});
