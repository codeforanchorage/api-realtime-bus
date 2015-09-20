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
    // Grab a list of stop & departure delays.
    let delays = repo.delays().then(function(offset) {
      var departures = offset;
      departures.forEach(function(stp) {
        // Departures with delays.
        let dl = stp.departure
          .filter(s => s.dev != '0');
        // dl.forEach(st => logDep(st));
      });
    });

    // Grab a full list of routes.
    let routes = repo.routes().then(function(rts) {
      // log(rts.filter(r => r.route_id == 75));
    });

    // Grab a full list of trips
    let trips = repo.trips().then(function(schedule) {
      // log(schedule.filter(r => r.route_id == 75));
    });

    // Grab a list of active buses.
    let buses = repo.buses().then(function(active) {
      // log(active.filter(b => b.speed != '0')); // Moving buses
    });

    // Grab live vehicle details (filter by trip_id)

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
