/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';

describeModule(
  'validator:match',
  'Unit - Validator - Match',
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      var validator = this.subject();
      expect(validator).to.be.ok;
    });
  }
);
