import Ember from 'ember';
import layout from '../templates/components/email-field';
import ValidatorMixin from 'validity/mixins/components/validate';

const EmailComponent = Ember.GlimmerComponent.extend(ValidatorMixin, {
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

EmailComponent.reopenClass({ isComponentFactory: true });

export default EmailComponent;
