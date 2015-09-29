import Ember from 'ember';

const {
  on,
  computed,
  RSVP
} = Ember;

export default Ember.Object.extend({
  baseURL:'',
  endPoint:'',

  _setup: on('init', function() {
    var config = this.container.lookupFactory('config:environment');
    this.set('baseURL', config.baseURL);
  }),

  url: computed('endPoint', function() {
    const url = [
      this.get('baseURL'),
      this.get('endPoint')
    ].join('');

    return url.replace(/\/\//g, '/');
  }),

  request(data, options) {
    return new RSVP.Promise( (resolve, reject)=> {
      const ajaxOptions = {
        url: this.get('url'),
        type: 'post',
        contentType: 'application/vnd.api+json',
        beforeSend: (xhr)=> {
          xhr.setRequestHeader('Accept', 'application/vnd.api+json');
        },
        dataType: 'json',
        data: JSON.stringify(data),
        success: resolve,
        error: (xhr)=> {
          reject(this.processErrors(xhr.responseJSON));
        }
      };

      Ember.$.ajax(ajaxOptions);
    });
  },

  processErrors(error) {
    // TODO: make this process multiple errors.
    return error.errors[0].detail;
  }
});
