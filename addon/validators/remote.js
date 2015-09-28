import Ember from 'ember';
import ValidatorBase from 'validity/validators/base';

export default ValidatorBase.extend({

  run() {
    const value = this.get('value');
    const options = this.get('options');

    Ember.assert('There is no URL to send the request to.', Ember.isPresent(options.url));

    const adapter = this.container.lookup('adapter:validity');
    adapter.endPoint = options.url;

    // Only make the request if a value is present
    if (value) {
      return adapter.request({value: value}, options);
    } else {
      return Ember.RSVP.Promise.reject();
    }
  }

});
