import Ember from 'ember';
import ValidatorMixin from 'validity/mixins/components/validate';

export default Ember.Component.extend(ValidatorMixin,{
  validations: {
    remote: {
      value: {
        on: 'focusOut',
        options: {
          url: '/api/presence'
        }
      }
    },
    presence: {
      value: {
        on: 'focusOut'
      },
      username: {
        on: 'focusOut'
      }
    },
    match: {
      value: {
        options: {
          regex: /^b$/
        }
      }
    }
  },

  actions: {
    submit() {
      this.validate();
    }
  }
});
