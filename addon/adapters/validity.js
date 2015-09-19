import Ember from 'ember';

export default Ember.Object.extend({
  baseURL:'',
  endPoint:'',

  _setup: Ember.on('init', function() {
    var config = this.container.lookupFactory('config:environment');
    this.set('baseURL', config.baseURL);
  }),

  url: Ember.computed('endPoint', function() {
    const url = [
      this.get('baseURL'),
      this.get('endPoint')
    ].join('');

    return url.replace(/\/\//g, '/');
  }),

  request(data,message) {
    return new Ember.RSVP.Promise( (resolve, reject)=> {
      const ajaxOptions = {
        url: this.get('url'),
        type: 'post',
        dataType: 'json',
        contentType: 'application/vnd.api+json',
        data: JSON.stringify(data),
        success: resolve,
        error: (xhr)=> {
          reject([this.processError(xhr.responseJSON, message)]);
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
