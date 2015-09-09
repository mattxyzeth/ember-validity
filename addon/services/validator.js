import Ember from 'ember';

const { RSVP } = Ember;

export default Ember.Service.extend({

  cache:{},

  validate(type, value, options) {
    return new RSVP.Promise( (resolve, reject)=> {
      const validatorName = `validator:${type}`;
      const cache = this.get('cache');
      let validator;

      // Use validator in cache or create a new one and save it.
      if (cache.hasOwnProperty(validatorName)) {
        validator = cache[validatorName];
      } else {
        const validatorFactory = this.container.lookupFactory(validatorName);

        if (validatorFactory) {
          validator = validatorFactory.create();
          this.cache[validatorName] = validator;
        }
      }

      if (Ember.isEmpty(validator)) {
        Ember.Logger.error(`Validator with the name ${type} was not found.`);
        return;
      } else {
        validator.run(value, options.message, options.options).then(resolve, reject);
      }
    });
  }

});
