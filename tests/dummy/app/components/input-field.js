import Ember from 'ember';
import ValidatorMixin from 'validity/mixins/components/validate';

export default Ember.Component.extend(ValidatorMixin,{
  validations: {
    type: 'presence',
    on: 'focusOut',
    options: {
      url: '/presence'
    }
  }
});
