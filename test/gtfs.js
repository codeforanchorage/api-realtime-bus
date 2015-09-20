'use strict';

var ProtoBuf = require('protobufjs');
var assert = require('assert');
var repo = require('./../src/repo');

function log(msg) {
  console.log(msg)
}

function logDep(dep) {
  log(dep);
  log(dep.route);
}

describe('ProtoBufJS (gtfs processing)', function() {
  it.skip('can encode and decode a TimeRange GTFS object', function() {

    // Load test proto instance.
    var builder = ProtoBuf.loadProtoFile('./gtfs/gtfs-realtime.proto');
    var root = builder.build('transit_realtime');
    var obj = new root.TimeRange();

    // Set values (pass validation)
    obj.start = 1;
    obj.end = 2;

    var rslt = root.TimeRange.decode(obj.encode());

    assert.equal(rslt.start.low, 1,
      'Expected start value of 1 in TimeRange instance');

  });
  it('can create a Trip Update from late departures', function(done) {
    this.timeout(45000);
    // Grab a list of stop & departure delays.
    let delays = repo.delays().then(function(offset) {
      // var departures = offset;
      // departures.forEach(function(stp) {
      //   // Departures with delays.
      //   let dl = stp.departure
      //     .filter(s => s.dev != '0');
      //   dl.forEach(st => logDep(st));
      // });
    });

    var trips = [];
    repo.buses().then(function(buses) {
      return repo.trips(buses);
    }).then(function(active) { // Active Trip List
      trips = active;
      return repo.delays();
    }).then(function(delayed) {
      done();
    });

    // Create a Trip Update object from live vehicle trip_ids
    

  });
});

describe.skip('csvtojson', function() {
  it('can read the routes.txt into JSON format', function(done) {
    repo.routes().then(function() {
      done();
    }).fail(function(err) {
      done(err);
    });
  });
  it('can read the trips.txt into JSON format', function(done) {
    repo.trips().then(function() {
      done();
    }).fail(function(err) {
      done(err);
    });
  });
});
