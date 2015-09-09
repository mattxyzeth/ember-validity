/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it,
  before
} from 'mocha';
import Ember from 'ember';
import ValidateMixin from 'validity/mixins/components/validate';

describe('ValidateMixin', function() {
  let ValidateObject;

  before(function() {
    ValidateObject = Ember.Object.extend(ValidateMixin,{
      validator: {
        validate(type,value) {
          return new Ember.RSVP.Promise( (resolve, reject)=> {
            if (value === 'fail') {
              reject({errors: [{message: 'Validation failed'}]});
            } else {
              resolve();
            }
          });
        }
      }
    });
  });

  it('works', function() {
    var subject = ValidateObject.create();
    expect(subject).to.be.ok;
  });
});
