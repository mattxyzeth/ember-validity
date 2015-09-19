import Ember from 'ember';
import ValidatorBase from 'validity/validators/base';

export default ValidatorBase.extend({

  run(value, message, options) {
    Ember.assert('There is no URL to send the request to.', Ember.isPresent(options.url));

    const adapter = this.container.lookup('adapter:validity');
    adapter.endPoint = options.url;

    return adapter.request({value: value});
  }

});
