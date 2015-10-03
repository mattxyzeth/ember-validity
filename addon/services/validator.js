import Ember from 'ember';

const { RSVP } = Ember;
const { keys } = Object;

export default Ember.Service.extend({

  /**
   * Runs the validators against the value then updates the validation states and errors object.
   *
   * @param {Object} validations The validations object from the caller.
   * @param {DS.Errors} errors The errors object from the caller.
   * @return {Promise} A promise to handle overriding results.
   */
  validate(validations, errors) {
    // Convert the validations to promises
    const promises = keys(validations).map((key)=> {
      const promise = validations[key].run();
      promise.key = key; // sets the validation object key to use later.
      return promise;
    });

    return new RSVP.Promise((resolve, reject)=> {
      RSVP.allSettled(promises).then((results)=> {
        let pass = true;

        for (let i=0, len = results.length; i < len; i++) {
          const reason = results[i].reason;
          const key = promises[i].key;
          let state = 'pending';

          if (results[i].state === 'rejected') {
            if (Ember.isPresent(reason)) {
              pass = false;
              errors.add(key, reason[0].message);
              state = 'fail';
            }
          } else {
            state = 'pass';
          }

          if (state === 'pending' || state === 'pass') {
            if (errors.has(key)) {
              errors.remove(key);
            }
          }

          validations[key].state = state;
        }

        if (pass) {
          resolve();
        } else {
          reject();
        }
      });
    });
  },

  /**
   * Takes a validations map object, registers and/or looks up
   * the validator and returns an array of validation objects.
   *
   * @param {Object} rules The validations map to convert
   * @return {Array} An array of validation objects
   */
  convertValidations(rules) {
    const types = keys(rules);
    const validations = {};

    function createValidator(factory, model, property, options) {
      let validator = factory.create();
      validator.setupProps(model, property, options);

      return validator;
    }

    types.forEach((type)=> {
      const validatorName = `validator:${type}`;

      // TODO: review if we can use a cached validator. Seems like creating and destroying validators
      // per form is not that big of a deal. Even with a form with 100 form fields, how much memory
      // would this actually take?
      //
      // Use validator in cache or create a new one.
      // if (!this.container.cache[validatorName]) {
      //   this.container.registry.register(validatorName, this.container.lookupFactory(validatorName));
      // }

      let validatorFactory = this.container.lookupFactory(validatorName);

      Ember.assert(`Validator with the name ${type} was not found.`, Ember.isPresent(validatorFactory));


      if (typeof rules[type] === 'object') {
        // handle multiple properties
        keys(rules[type]).forEach((property)=> {
          const options = rules[type][property] === true ? {} : rules[type][property].options || {};

          validations[`${type}:${property}`] = createValidator(validatorFactory, this, property, options);
        });
      } else {
        validations[`${type}:${rules[type]}`] = createValidator(validatorFactory, this, rules[type], {});
      }

    });

    return validations;
  }


});
