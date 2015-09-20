'use strict';

var assert = require('assert');
var http = require('http');
var q = require('q');
var fs = require('fs');
var parseString = require('xml2js').parseString;

// Fetches all stops & depatures, return an Obj array
function fetchStopsDepartures(liveFetch) {
  var options = {
    host: 'bustracker.muni.org',
    path: '/InfoPoint/XML/stopdepartures.xml',
    agent: false,
    headers: { 'Cache-Control': 'no-cache' },
  };
  var d = q.defer();
  var sd = __dirname + '/stopdepartures.xml';

  if (fs.existsSync(sd) && !liveFetch) {
    // Grab a local file, parse results.
    fs.readFile(sd, function(err, data) {
      if (err) { throw err; };
      parseStops(data, d);
    });
  } else {
    // Grab feed, parse results.
    http.get(options, parse);

    // Process the feed
    function parse(res) {
      var data = '';
      res.on('data', function(chunk) {
        data = data + chunk;
      });
      res.on('end', function() {
        parseStops(data, d);
      });
    };
  }

  return d.promise;

};

// Fetches all vehicle locations, return an Obj array
function fetchVehicleLocations(liveFetch) {
  var options = {
    host: 'bustracker.muni.org',
    path: '/InfoPoint/XML/vehiclelocation.xml',
    agent: false,
    headers: { 'Cache-Control': 'no-cache' },
  };
  var d = q.defer();
  var sd = __dirname + '/vehiclelocation.xml';

  if (fs.existsSync(sd) && !liveFetch) {
    // Grab a local file, parse results.
    fs.readFile(sd, function(err, data) {
      if (err) { throw err; };
      parseVehicles(data, d);
    });
  } else {
    // Grab feed, parse results.
    http.get(options, parse);

    // Process the feed
    function parse(res) {
      var data = '';
      res.on('data', function(chunk) {
        data = data + chunk;
      });
      res.on('end', function() {
        parseVehicles(data, d);
      });
    };
  }

  return d.promise;

};

function parseStops(data, d) {
  parseString(data, function(err, result) {
    console.log('      Data From: ' + result.departures.generated[0]._);
    d.resolve({
      time: result.departures.generated[0]._,
      data: result,
    });
  });
};

function parseVehicles(data, d) {
  parseString(data, function(err, result) {
    console.log('      Data From: ' +
      result['vehicle-locations']['report-generated'][0]._);
    d.resolve({
      time: result['vehicle-locations']['report-generated'][0]._,
      data: result['vehicle-locations'].vehicle,
    });
  });
};

module.exports.stopsdepartures = fetchStopsDepartures;
module.exports.vehiclelocations = fetchVehicleLocations;
