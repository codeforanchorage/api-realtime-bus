// Muni XML Feed Parser
var parser = require('./../parser');
var assert = require('assert');

describe('Data Parser', function() {
  it('can grab Muni routes and departures xml, and can serialize it',
  function(done) {
    this.timeout(15000);

    // Promise out xml conversion.
    parser.stopsdepartures()
          .then(function(result) {
            assert.equal(result.data.departures !== undefined, true);
            done();
          });
  });
});
