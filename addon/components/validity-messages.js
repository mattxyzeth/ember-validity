import Ember from 'ember';
import DS from 'ember-data';

const {
  GlimmerComponent,
  computed
} = Ember;

let ValidityMessages = GlimmerComponent.extend({

  errors: computed('attrs.errors.[]', function() {
    const errors = this.attrs.errors;

    if (errors && !(errors instanceof DS.Errors)) {
      errors.isEmpty = errors.length === 0;
    }

    return errors;
  }),

  errorClass: computed('attrs.errorClass', function() {
    return this.attrs.errorClass || 'validity-error';
  })

});

ValidityMessages.reopenClass({isComponentFactory:true});

export default ValidityMessages;
