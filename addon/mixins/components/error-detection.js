import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * A Boolean property to indicate if any errors are present.
   *
   * @property {Boolean} hasErrors
   * @readOnly
   */
  hasErrors: Ember.computed('attrs.errors', 'errors', function() {
    if (this.isGlimmerComponent) {
      let errors = this.attrs.errors || this.get('errors');
      return errors && !!errors.length;
    } else {
      return this.get('errors') && !!this.get('errors').length;
    }
  }),

  /**
   * A boolean property that indicates if the validations are in a pending state or not.
   *
   * @property {Boolean} validityPenging
   * @readOnly
   */
  validityPending: Ember.computed('validations', function() {
    const validations = this.get('validations');

    if (validations) {
      let pending = true;

      Object.keys(validations).forEach((key)=> {
        if (validations[key].state !== 'pending') {
          pending = false;
        }
      });

      return pending;
    } else {
      return false;
    }
  }).volatile()
});
