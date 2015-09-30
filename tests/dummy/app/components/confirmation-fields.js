import Ember from 'ember';
import ValidationMixin from 'validity/mixins/components/validate';

export default Ember.Component.extend(ValidationMixin, {

  validations: {
    confirmation: {
      password: {
        options: {
          confirm: 'passwordConfirmation'
        }
      }
    }
  },

  actions: {
    submit() {
      this.validate()['finally'](()=> {
        console.log(this.get('errors.messages'));
      });
    }
  }

});
