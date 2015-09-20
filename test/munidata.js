'use strict';

// Muni XML Feed Parser
var parser = require('./../src/parser');
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

  it('can grab Muni vehicles xml, and can filter active buses', function(done) {
    this.timeout(5000);
    parser.vehiclelocations(false) // Live Fetch?
      .then(function(result) {
      let buses = Array.from(result.data).filter(function(bus) {
        return bus.tripid != 0;
      });
      if (buses.length === 0) {
        done(Error('Vehicles were not filtered for active tripid'));
      } else {
        done();
      }
    });
  });

  it('can return all stops with delays in their departures', function(done) {
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
