import Ember from 'ember';

export default Ember.Mixin.create({
  hasErrors: Ember.computed('attrs.errors', 'errors', function() {
    if (this.isGlimmerComponent) {
      return this.attrs.errors && !!this.attrs.errors.length;
    } else {
      return this.get('errors') && !!this.get('errors').length;
    }
  }),

  errorsUndefined: Ember.computed('attrs.errors', 'errors', function() {
    if (this.isGlimmerComponent) {
      return typeof this.attrs.errors === 'undefined';
    } else {
      return typeof this.get('errors') === 'undefined';
    }
  })
});
