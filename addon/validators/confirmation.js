import Ember from 'ember';
import BaseValidator from 'validity/validators/base';

const {
  RSVP,
  isEmpty
} = Ember;

export default BaseValidator.extend({

  defaultMessage: 'The values must match',

  /**
   * Runs the validation against the value and returns
   * a Promise that either resolves if the validation passed
   * or rejects if the validation failed.
   *
   * @return {Promise} A Promise that resolves to the result of the validation
   */
  run() {
    const value = this.get('value');
    const model = this.get('model');
    let attr = this.get('options.confirm');

    if (model.isGlimmerComponent) {
      attr = 'attrs.'.concat(attr);
    }

    const confirmValue = this.get('model').get(attr);

    return new RSVP.Promise((resolve, reject)=> {
      if (value !== confirmValue) {
        if (isEmpty(value) || isEmpty(confirmValue)) {
          reject();
        } else {
          reject([this.get('message')]);
        }
      } else {
        resolve();
      }
    });
  }

});
