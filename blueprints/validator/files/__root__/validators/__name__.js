import Ember from 'ember';
import BaseValidator from 'validity/validators/base';

const { RSVP } = Ember;

export default BaseValidator.extend({

  /**
   * Runs the validation against the given value and returns
   * a Promise that either resolves if the validation passed
   * or rejects if the validation failed.
   *
   * @param {Mixed} value The value to run the validation against
   * @param {Object} options An object with any options the validator might consume
   * @return {Promise} A Promise that resolves to the result of the validation
   */
  run(/*value, options*/) {
    return new RSVP.Promise.resolve();
  }

});
