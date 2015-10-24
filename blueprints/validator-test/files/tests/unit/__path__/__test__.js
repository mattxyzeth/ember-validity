import { test, moduleFor } from 'ember-qunit';

moduleFor('<%= dasherizedModuleName %>', '<%= friendlyTestName %>', {
  // Specify the other units that are required for this test.
<%= typeof needs !== 'undefined' ? needs : '' %>
});

test('it exists', function(assert) {
  var validator = this.subject();
  assert.ok(!!validator);
});
