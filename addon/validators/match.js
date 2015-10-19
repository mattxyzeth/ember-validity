import Ember from 'ember';
import BaseValidator from 'validity/validators/base';

const {
  RSVP,
  assert,
  isPresent
} = Ember;

export default BaseValidator.extend({

  /**
   * The default message to return if the validation failed.
   * This will be overridden if a message is supplied in the
   * validation map's options hash.
   *
   * @property {String}
   */
  defaultMessage: 'The validation failed',

  /**
   * Runs the validation against the value and returns
   * a Promise that either resolves if the validation passed
   * or rejects if the validation failed.
   *
   * @return {Promise} A Promise that resolves to the result of the validation
   */
  run() {
    this._super();

    const value = this.get('value');
    const options = this.get('options');

    assert('You need to specify a RegEx to match against', isPresent(options.regex));

    return new RSVP.Promise((resolve, reject)=> {
      if (options.regex.test(value)) {
        this.validationSucceeded();
        resolve();
      } else {
        this.validationFailed();
        reject();
      }
    });
  }

});

