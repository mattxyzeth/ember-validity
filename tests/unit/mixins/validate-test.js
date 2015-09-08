/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ValidateMixin from 'validity/mixins/validate';

describe('ValidateMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    var ValidateObject = Ember.Object.extend(ValidateMixin);
    var subject = ValidateObject.create();
    expect(subject).to.be.ok;
  });
});
