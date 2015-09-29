import Ember from 'ember';
import ValidatorBase from 'validity/validators/base';

export default ValidatorBase.extend({

  defaultMessage: 'This is a required field.',

  run() {
    const value = this.get('value');
    const message = this.get('message');

    return new Ember.RSVP.Promise( (resolve, reject)=> {
      if (value && value.length) {
        resolve();
      } else {
        reject([message]);
      }
    });
  }

});
