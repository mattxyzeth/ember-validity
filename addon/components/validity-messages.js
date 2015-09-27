import Ember from 'ember';

let ValidityMessages = Ember.GlimmerComponent.extend({

  errorClass: Ember.computed('attrs.errorClass', function() {
    return this.attrs.errorClass || 'validity-error';
  })

});

ValidityMessages.reopenClass({isComponentFactory:true});

export default ValidityMessages;
