import Ember from 'ember';
import BaseValidator from 'validity/validators/base';

const { RSVP } = Ember;

export default BaseValidator.extend({

  /**
   * Runs the validation against the value and returns
   * a Promise that either resolves if the validation passed
   * or rejects if the validation failed.
   *
   * @return {Promise} A Promise that resolves to the result of the validation
   */
  run() {
    return new RSVP.Promise.resolve();
  }

});
