import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Object.extend({

  /**
   * The object to retrieve the values from. This is set by the
   * consuming object.
   *
   * @property {Object} model
   */

  /**
   * The options the validator might consume. This is set by the
   * consuming object.
   *
   * @property {Object} options
   */

  /**
   * The property on the model to run the validation against. This
   * is set by the consuming object.
   *
   * @property {String} property
   */

  /**
   * The state of the validation
   *
   * @property {String} state
   * @default pending
   */
  state: 'pending',

  /**
   * The message to return if the validation fails.
   *
   * @property {Object)
   */
  message: computed('options', function() {
    const options = this.get('options');

    return { message: options.message || this.get('defaultMessage') };
  }),

  /**
   * The value to run the validations against
   *
   * @property {Mixed} value
   */
  value: computed('model', 'options', function() {
    const property = this.get('property');
    const model = this.get('model');
    let value;

    if (model.isGlimmerComponent && model.attrs[property]) {
      value = model.attrs[property];
    } else {
      value = model.get(property);
    }

    return value;
  }).volatile()

});
