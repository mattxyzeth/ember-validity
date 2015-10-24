import Ember from 'ember';
import ValidationMixin from 'ember-validity/mixins/components/validate';

export default Ember.Component.extend(ValidationMixin, {

  validations: {
    confirmation: {
      password: {
        on: 'focusOut',
        confirm: 'passwordConfirmation'
      }
    }
  },

  actions: {
    submit() {
      this.validate();
    }
  }

});
