/*jshint node:true*/

module.exports = {
  description: 'Generates a validator unit test',

  locals: function(options) {
    return {
      friendlyTestName: 'Unit - Validator - ' + options.entity.name
    };
  }
};
