import Ember from 'ember';
import ValidatorBase from 'validity/validators/base';

export default ValidatorBase.extend({

  run(value, message, options) {
    Ember.assert('There is no URL to send the request to.', Ember.isPresent(options.url));

    return new Ember.RSVP.Promise( (resolve, reject)=> {
      const ajaxOptions = {
        url: options.url,
        type: 'post',
        dataType: 'json',
        contentType: 'application/vnd.api+json',
        data: JSON.stringify({value:value}),
        success: resolve,
        error: (xhr,response,error)=> {
          reject(this.processError(xhr.responseJSON));
        }
      };

      Ember.$.ajax(ajaxOptions);
    });
  },

  processError(error,message) {
    return {
      message: message || error.errors[0].detail
    };
  }

});
