'use strict';

// Muni XML Feed Parser
var parser = require('./../parser');
var assert = require('assert');

describe('Data Parser', function() {
  it('can grab Muni routes and departures xml, and can serialize it',
  function(done) {
    this.timeout(5000);

    // Promise out xml conversion.
    parser.stopsdepartures(false) // Live Fetch?
          .then(function(result) {
            assert.equal(result.data.departures !== undefined, true);
            done();
          });
  });
});

describe('Data Parser', function() {
  it('can return all stops with delays', function(done) {
    this.timeout(5000);

    // Promise out xml conversion.
    parser.stopsdepartures(false) // Live Fetch?
          .then(function(result) {
            let stops = Array.from(result.data.departures.stop);
            // Stop delay filter.
            function hasDelays(stop) {
              // Grab stop's departures.
              let departures = Array.from(stop.departure);
              // Filter departures with late buses
              return departures.filter(function(depart) {
                return depart.dev != '0'; // Bus is Late.
              }).length > 0;
            }
            let delays = stops.filter(hasDelays);
            if (delays.length === 0) {
              done(Error('Stops were not filtered for delays'));
            } else {
              done();
            }
          });
  });
});
