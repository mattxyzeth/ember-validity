import Ember from 'ember';
import ValidatorMixin from 'validity/mixins/components/validate';

export default Ember.Component.extend(ValidatorMixin,{
  validations: {
    type: 'remote',
    on: 'focusOut',
    options: {
      url: '/api/presence'
    }
  }
});
