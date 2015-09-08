import Ember from 'ember';
import ValidatorBase from 'validity/validators/base';

export default ValidatorBase.extend({

  run(value,options) {
    Ember.assert('There is no URL to send the request to.', Ember.isPresent(options.url));

    return new Ember.RSVP.Promise( (resolve, reject)=> {
      const ajaxOptions = {
        url: options.url,
        type: 'post',
        contentType: 'application/vnd.api+json',
        data: {value:value},
        success: resolve,
        error: (xhr,response,error)=> {
          console.log(xhr,response,error);
          reject();
        }
      };

      Ember.$.ajax(ajaxOptions);
    });
  },

  processError(error) {
    return error;
  }

});
