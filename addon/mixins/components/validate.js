import Ember from 'ember';

const { on, inject } = Ember;

export default Ember.Mixin.create({

  validator: inject.service(),

  _setup: on('init', function() {
    const eventName = this.get('validations.on');

    if (eventName) {
      this.on(eventName, this.handleEvent);
    }
  }),

  handleEvent() {
    console.log(this);
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
    const options = this.get('validations');
    const valueProperty = options.valueProperty || 'value';
    const value = this.get(valueProperty);

    return this.get('validator').validate(value,options);
  }
});
