import Ember from 'ember';
import ValidatorBase from 'validity/validators/base';

export default ValidatorBase.extend({

  errorMsg: {
    message: 'This is a required field.'
  },

  run(value) {
    return new Ember.RSVP.Promise( (resolve, reject)=> {
      if (value && value.length) {
        resolve();
      } else {
        reject([this.get('errorMsg')]);
      }
    });
  }

});
