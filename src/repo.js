'use strict';

var parser = require('./parser');
var q = require('q');
var fs = require('fs');
var Converter = require('csvtojson').Converter;

var liveData = true;

function log(msg) {
  console.log(msg);
}

// Get departure delays
function fetchStopAndDepartureDelays() { // Active Trips
  var d = q.defer();

  parser.stopsdepartures(liveData)
    .then(function(result) {
      let stops = result.data.departures.stop;
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
        d.reject(Error('Stops were not filtered for delays!'));
      } else {
        d.resolve(delays);
      }
    });

  return d.promise;

};

// Get active bus list. (tripid list)
function fetchActiveBuses() {
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
function fetchRoutes() {
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

// Get list of route with active buses
function fetchTrips(buses) {
  var d = q.defer();
  var rfs = fs.createReadStream('./gtfs/trips.txt');
  var converter = new Converter({ constructResult: true });
  converter.on('end_parsed', function(trips) {
    if (buses != undefined) {

      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      // log('$------ [ Routes ] ------$');
      // log(trips.filter(t => t.route_id == 7));
      // log('$------ [ Buses ] ------$');
      // log(buses.filter(b => b.routeid == '7'));
      // log('$------ [ Active Routes ] ------$');

      d.resolve([]);

    };
    function getTrips(route, tripid) {

      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      // log(jsonTrips.filter(t => t.route_id == route.length);

      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      return jsonTrips
        .filter(t => t.route_id == route)
        .filter(t => t.trip_id.toString().indexOf(tripid + '-') > -1);
    };
  });

  // Read from file
  rfs.pipe(converter);

  return d.promise;

}

module.exports.delays = fetchStopAndDepartureDelays;
module.exports.buses = fetchActiveBuses
module.exports.routes = fetchRoutes;
module.exports.trips = fetchTrips;
