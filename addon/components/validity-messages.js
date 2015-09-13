import Ember from 'ember';
import ErrorDetectionMixin from 'validity/mixins/components/error-detection';

let ValidityMessages = Ember.GlimmerComponent.extend(ErrorDetectionMixin, {

  errorClass: Ember.computed('attrs.errorClass', function() {
    return this.attrs.errorClass || 'validity-error';
  })

});

ValidityMessages.reopenClass({isComponentFactory:true});

export default ValidityMessages;
