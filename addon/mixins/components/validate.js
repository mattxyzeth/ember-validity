import Ember from 'ember';

const { on, inject } = Ember;

export default Ember.Mixin.create({

  validator: inject.service(),

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
        console.log('success');
      },
      (errors)=> {
        console.log(errors);
      }
    );
  },

  validate() {
    const defaults = this.get('defaultOptions');
    const options = Ember.merge(defaults, this.get('validations'));
    const value = this.get(options.valueProperty);

    return this.get('validator').validate(options.type,value,options);
  }
});
