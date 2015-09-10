import Ember from 'ember';

const { on, inject } = Ember;

export default Ember.Mixin.create({

  validator: inject.service(),

  hasError: Ember.computed('errors', function() {
    return this.get('errors') && !!this.get('errors').length;
  }),

  defaultOptions: {
    type: 'presence',
    valueProperty: 'value',
    options: {}
  },

  _setup: on('init', function() {
    const eventName = this.get('validations.on');

    if (eventName) {
      this.on(eventName, this.validateByEvent);
    }
  }),

  validateByEvent() {
    this.validate().then(
      ()=> {
        this.set('errors', []);
      },
      (errors)=> {
        this.set('errors', errors);
      }
    )['finally'](()=> {
      // Report to the parent the error state
      if (this.attrs && this.attrs.reportError) {
        // for Glimmer components
        this.attrs.reportError(this, this.get('hasError'));
      } else {
        // otherwise use sendAction
        this.sendAction('reportError', this, this.get('hasError'));
      }
    });
  },

  validate() {
    const defaults = this.get('defaultOptions');
    const options = Ember.merge(defaults, this.get('validations'));

    // Check is this is a Glimmer Component that uses the new attrs property
    let value;
    if (this.attrs) {
      value = this.attrs[options.valueProperty];
    } else {
      value = this.get(options.valueProperty);
    }

    return this.get('validator').validate(options.type,value,options);
  }
});
