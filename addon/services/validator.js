import Ember from 'ember';

const {
  RSVP,
  isEmpty
} = Ember;
const { keys } = Object;

export default Ember.Service.extend({

  /**
   * Runs the validators and updates errors object.
   *
   * @param {Object} validations The validations object from the caller.
   * @param {DS.Errors} errors The errors object from the caller.
   * @return {Promise} A promise to handle overriding results.
   */
  validate(validations, errors) {
    const promises = keys(validations).reduce((result, key)=> {
      errors.remove(key);

      validations[key].forEach((validator)=> {
        const promise = validator.run();
        promise.key = key;
        result.push(promise);
      });

      return result;
    }, []);

    return new RSVP.Promise((resolve, reject)=> {
      RSVP.allSettled(promises).then((results)=> {
        let pass = true;

        for (let i = 0, len = results.length; i < len; i=i+1) {
          const key = promises[i].key;
          const result = results[i];

          if (result.state === 'rejected' && result.reason) {
            pass = false;

            result.reason.forEach((error)=> {
              errors.add(key, error.message);
            });
          }
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

    function createValidator(factoryName, model, property, options) {
      const validatorFactory = model.container.lookupFactory(factoryName);

      Ember.assert(`Validator with the name ${factoryName} was not found.`, Ember.isPresent(validatorFactory));

      let validator = validatorFactory.create();
      validator.setupProps(model, property, options, factoryName);

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


      if (typeof rules[type] === 'object') {
        // handle multiple properties
        keys(rules[type]).forEach((property)=> {
          const options = rules[type][property] === true ? {} : rules[type][property].options || {};

          if (isEmpty(validations[property])) {
            validations[property] = [];
          }

          validations[property].push(createValidator(validatorName, this, property, options));
        });
      } else {
        if (isEmpty(validations[rules[type]])) {
          validations[rules[type]] = [];
        }

        validations[rules[type]].push(createValidator(validatorName, this, rules[type], {}));
      }

    });

    return validations;
  }


});
