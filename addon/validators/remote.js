import Ember from 'ember';
import ValidatorBase from 'ember-validity/validators/base';

const { RSVP } = Ember;

export default ValidatorBase.extend({

  defaultMessage: 'The validation failed',

  run() {
    const value = this.get('value');
    const options = this.get('options');

    Ember.assert('There is no URL to send the request to.', Ember.isPresent(options.url));

    this._super();

    const adapter = this.container.lookup('adapter:validity');
    adapter.endPoint = options.url;

    // Only make the request if a value is present
    if (value) {
      return new RSVP.Promise((resolve, reject)=> {
        adapter.request({value: value}).then(
          ()=> {
            this.validationSucceeded();
            resolve();
          },
          (response)=> {
            this.set('defaultMessage', response);
            this.validationFailed();
            reject();
          }
        );
      });
    } else {
      return RSVP.Promise.reject();
    }
  }

});
