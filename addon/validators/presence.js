import Ember from 'ember';
import ValidatorBase from 'validity/validators/base';

export default ValidatorBase.extend({

  defaultMessage: 'This is a required field.',

  run() {
    const value = this.get('value');

    this._super();

    return new Ember.RSVP.Promise( (resolve, reject)=> {
      if (value && value.length) {
        this.validationSucceeded();
        resolve();
      } else {
        this.validationFailed();
        reject();
      }
    });
  }

});
