import Ember from 'ember';
import layout from '../templates/components/email-field';
import ValidatorMixin from 'ember-validity/mixins/components/validate';

const EmailFieldComponent = Ember.GlimmerComponent.extend(ValidatorMixin, {
  layout: layout,

  validations: {
    presence: 'email',
    email: 'email'
  },

  actions: {
    submit() {
      this.validate();
    }
  }
});

EmailFieldComponent.reopen({ isComponentFactory: true });

export default EmailFieldComponent;
