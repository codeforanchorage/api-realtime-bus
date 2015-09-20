'use strict';

var parser = require('./parser');
var q = require('q');
var fs = require('fs');
var Converter = require('csvtojson').Converter;

var liveData = false;

// Get departure delays
module.exports.delays = function() {
  var d = q.defer();

  parser.stopsdepartures(liveData).then(function(result) {
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
      d.reject(Error('Stops were not filtered for delays'));
    } else {
      d.resolve(delays);
    }
  });

  return d.promise;

};

// Get active bus list. (tripid list)
module.exports.activebuses = function() {
  var d = q.defer();

  parser.vehiclelocations(liveData)
    .then(function(result) {
    let buses = Array.from(result.data).filter(function(bus) {
      return bus.tripid != 0;
    });

    if (buses.length === 0) {
      d.reject(Error('No active buses were returned'));
    } else {
      d.resolve(buses);
    }
  });

  return d.promise;
}

// Get list of routes
module.exports.routes = function() {
  var d = q.defer();

  var rfs = fs.createReadStream('./gtfs/routes.txt');
  var converter = new Converter({ constructResult: true });
  converter.on('end_parsed', function(jsonObj) {
    d.resolve(jsonObj);
  });
  // Read from file
  rfs.pipe(converter);

  return d.promise;

}
