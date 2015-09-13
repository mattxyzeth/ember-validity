# Validity

### Component configuration

```javascript
export default Ember.Component.extend({
  validation: {
    type: '', // The type of validation to run
    valueProperty: '', // What is the name of the property that holds the value
    on: '', // If you'd like to run the validation on a DOM event
    message: '', // If you'd like to override the default message.
    options: {} // Each validator will have their own set of options.
  }
});
```
If you didn't include a DOM event to trigger the validation, you can call `validate` yourself. The validation method will return a Promise so you can catch the errors yourself, or you can leave it up to Validity which will add all the errors to the errors object.

Example
```javascript
this.validate()['catch']( (errors)=> {
  // handle the errors yourself
});
```

And since it is a Promise, guess what!?! You can also handle a success response to do some cool UI changes.

Example
```javascript
this.validate().then( ()=> {
  // can you handle the success...?
});
```



### Validators

Create custom validators.


### Error Messages

Use the `validator-messgages` component to display your error messages. Simply add the component to your template and pass it the errors object.

### Error Detection Mixin

If you'd like support for detecting when your validators return errors, add the `error-detection` mixin to your component and you will have the `hasErrors` and `errorsUndefined` properties available to use.

```handlebars
{{#unless errorsUndefined}}
  {{#if hasErrors}}
    <p>There was an error</p>
  {{else}
    <p>All is good</p>
  {{/if}
{{/unless}}
```

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
