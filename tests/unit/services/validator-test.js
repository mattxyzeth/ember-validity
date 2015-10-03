/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';

import { describe } from 'mocha';
import PresenceValidator from 'validity/validators/presence';

describeModule(
  'service:validator',
  'Unit - Service - Validator',
  {
    // Specify the other units that are required for this test.
    needs: ['validator:presence']
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      var service = this.subject();
      expect(service).to.be.ok;
    });

    describe('Converting the validation map object', function() {

      it('converts a single string into a validator with empty options', function() {
        const validations = {
          presence: 'prop'
        };

        const validators = this.subject().convertValidations(validations);

        expect(validators).to.have.property('presence:prop');
        expect(validators['presence:prop']).to.be.instanceof(PresenceValidator);
      });

      it('converts an object with options into a validator', function() {
        const validations = {
          presence: {
            prop: {
              options: {
                message: 'This is the message'
              }
            }
          }
        };

        const validators = this.subject().convertValidations(validations);
        const presence = validators['presence:prop'];

        expect(presence.get('options')).to.have.property('message');
        expect(presence.get('model')).to.equal(this.subject());
        expect(presence.get('property')).to.equal('prop');
      });

      it('converts an object with a property set to true to a validator', function() {
        const validations = {
          presence: {
            prop: true
          }
        };

        const validators = this.subject().convertValidations(validations);
        const presence = validators['presence:prop'];

        expect(presence).to.be.instanceof(PresenceValidator);
        expect(presence.get('property')).to.equal('prop');
      });
    });

    it('runs the validators');
  }
);
