'use strict';

var ProtoBuf = require('protobufjs');
var assert = require('assert');
var repo = require('./../src/repo');

describe('ProtoBufJS (gtfs processing)', function() {
  it('can encode and decode a TimeRange GTFS object', function() {

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
  it('can create an encoded FeedMessage GTFS object', function(done) {
    var transit = ProtoBuf.protoFromFile('./gtfs/gtfs-realtime.proto')
        .build('transit_realtime');
    var fm = new transit.FeedMessage();
    var fh = new transit.FeedHeader();
    var fe = new transit.FeedEntity();

    // Fill with sample data (Pass validation rules)
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    fh.gtfs_realtime_version = '1';
    fh.incrementality = '0';
    fh.timestamp = '2';
    fm.header = fh;
    fe.id = '1';
    fm.entity = fe;

    try {
      fm.encode();
      done();
    } catch (ex) {
      done(ex);
    }
  });
  it('can create a Trip Update from late departures', function(done) {
    // Grab a list of stop & departure delays.
    let delays = repo.delays().then(function(offset) {
      console.log(offset);
    });

    // Grab a full list of routes.
    let routes = repo.routes().then(function(routes) {
      // console.log(routes);
    });

    // Grab a full list of trips
    let trips = repo.trips().then(function(schedule) {
      // console.log(schedule);
    });

    // Grab a list of active buses.
    let buses = repo.buses().then(function(active) {
      // console.log(active);
    });

    // Grab live vehicle details (filter by trip_id)

    // Create a Trip Update object from live vehicle trip_ids
    done();
  });
});

describe('csvtojson', function() {
  it('can read the routes.txt into JSON format', function(done) {
    repo.routes().then(function() {
      done();
    }).fail(function(err) {
      done(err);
    });
  });
});

describe('csvtojson', function() {
  it('can read the trips.txt into JSON format', function(done) {
    repo.trips().then(function() {
      done();
    }).fail(function(err) {
      done(err);
    });
  });
});
