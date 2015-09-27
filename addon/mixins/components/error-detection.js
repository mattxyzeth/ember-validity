import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * A Boolean property to indicate if any errors are present.
   *
   * @property {Boolean} hasErrors
   * @readOnly
   */
  hasErrors: Ember.computed('attrs.errors.[]', 'errors.[]', function() {
    let errors;

    if (this.isGlimmerComponent) {
      errors = this.attrs.errors || this.get('errors');
    } else {
      errors = this.get('errors');
    }
    console.log(errors && !errors.get('isEmpty'));
    return errors && !errors.get('isEmpty');
  }).volatile()
});
