import Ember from 'ember';
import BaseValidator from 'ember-validity/validators/base';

const { RSVP } = Ember;

export default BaseValidator.extend({

  /**
   * The default message to return if the validation failed.
   * This will be overridden if a message is supplied in the
   * validation map's options hash.
   *
   * @property {String}
   */
  defaultMessage: 'This option is mandatory.',

  /**
   * Runs the validation against the value and returns
   * a Promise that either resolves if the validation passed
   * or rejects if the validation failed.
   *
   * @return {Promise} A Promise that resolves to the result of the validation
   */
  run() {
    const value = this.get('value');
    // const options = this.get('options');
    // const message = this.get('message');
    // const model = this.get('model');

    return new RSVP.Promise((resolve, reject)=> {
      if (value) {
        this.validationSucceeded();
        resolve();
      } else {
        this.validationFailed();
        reject();
      }
    });
  }

});
