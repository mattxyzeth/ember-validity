# Ember-Validity

__This is a WIP ember-addon. Feel free to submit PR's or suggestions, but use at your own risk.__

This ember add-on is a simple straight forward way to add validation rules to an ember object that will run validator classes against a given set of property values. You simply add the mixin to the object that will handle the validations, define your validation map then call the `validate` method and process the promise. The promise will pass a boolean defining if the validations passed or not. All the error messages will be added to a DS.Errors object on the object you add the mixin to.

### Component configuration

```javascript
export default Ember.Component.extend({
  validation: {
    validationName: { // Can be either an object of property names as keys and true or configuration as values
      propertyName: true,
      anotherPropertyName: {
        on: 'focusOut', // DOM event to trigger the validaton on (optional)
        message: 'Custom message to use' // Or omit to fall back to a default message in the validator
      }
    }
  }
});
```

Call validate and process the `then` method.

```javascript
this.validate().then((isValid)=> {
  if (isValid) {
    // finish the process.
  }
});
```

### Validators

Create custom validators.

ember-validity comes with several validators. Please review them in the `addon/validators/` directory.

### Error Messages

All error messages are added to a DS.Errors object that is found or added to the object you add the mixin to. So if you mixed in to a DS.Model, the errors would be added to the Model's DS.Errors object and related to the Model's properties. Or if you mixed in to a component, a DS.Errors object will be created for you.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
