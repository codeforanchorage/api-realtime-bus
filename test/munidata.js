'use strict';

// Muni XML Feed Parser
var parser = require('./../src/parser');
var assert = require('assert');
var repo = require('./../src/repo');

describe('Data Parser', function() {
  it('can grab Muni routes and departures xml, and can serialize it',
  function(done) {
    this.timeout(5000);
    // Promise out xml conversion.
    parser.stopsdepartures(false) // Live Fetch?
          .then(function(result) {
            assert.equal(result.data.departures !== undefined, true);
            done();
          }).fail(function(err) {
            done(err);
          });
  });
  it('can grab Muni vehicles xml, and can filter active buses', function(done) {
    this.timeout(5000);
    repo.buses().then(function(buses) {
      done();
    }).fail(function(err) {
      done(err);
    });
  });
  it('can return all stops with delays in their departures', function(done) {
    this.timeout(5000);
    repo.delays().then(function(delays) {
      if (delays.length === 0) {
        done(Error('Stops were not filtered for delays'));
      } else {
        done();
      }
    }, function(err) {
      done(err);
    });
  });
});
