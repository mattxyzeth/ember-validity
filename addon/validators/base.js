import Ember from 'ember';

const {
  computed,
  merge,
  isPresent,
  RSVP
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

  eventRules() {
    return {property: this.get('property'), validator: this};
  },

  /**
   * Sets the properties used for this validator and merges any user
   * defined options with the default ones.
   *
   * @method setupProps
   * @param {Object} model The model to get values from
   * @param {String} property The name of the property of the value to test
   * @param {Object} options The user defined options for the validator
   * @return Undefined
   */
  setupProps(model, property, options, factoryName) {
    const defaultOptions = this.get('options') || {};
    const validatorName = factoryName.split(':')[1];

    this.setProperties({
      model,
      property,
      validatorName,
      options: isPresent(options) ? merge(defaultOptions, options) : defaultOptions
    });
  },

  /**
   * The message to return if the validation fails.
   *
   * @property {Object)
   */
  message: computed('options', function() {
    const options = this.get('options');

    return options.message || this.get('defaultMessage');
  }),

  resetState() {
    this.set('state', 'pending');

    // Remove the observer immediatly so we don't have lingering observers.
    this.get('model').removeObserver(this.get('property'), this, this.resetState);
  },

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
  })['volatile'](),

  toString() {
    return this._debugContainerKey.split(':')[1];
  },

  validationFailed() {
    const errors = this.get('model.errors');
    errors.add(this.get('property'), this.get('message'));

    // Add an observer to the models property so we can reset the state once it's interacted with.
    this.get('model').addObserver(this.get('property'), this, this.resetState);

    this.set('state', 'fail');
  },

  validationSucceeded() {
    this.set('state', 'pass');
  },

  run() {
    this.set('state', 'pending');

    return RSVP.Promise.resolve();
  }

});
