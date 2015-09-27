import Ember from 'ember';
import ValidatorBase from 'validity/validators/base';

export default ValidatorBase.extend({

  errorMsg: {
    message: 'This is a required field.'
  },

  run(value, options) {
    let message;
    if (options && options.message) {
      message = {
        message: options.message
      };
    } else {
      message = this.get('errorMsg');
    }

    return new Ember.RSVP.Promise( (resolve, reject)=> {
      if (value && value.length) {
        resolve();
      } else {
        reject([message]);
      }
    });
  }

});
