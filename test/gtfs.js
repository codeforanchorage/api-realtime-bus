'use strict';

var ProtoBuf = require('protobufjs');
var assert = require('assert');
var fs = require('fs');
var Converter = require('csvtojson').Converter;

describe('ProtoBufJS (.proto gtfs processing)', function() {
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
});

describe('GTFS Files', function() {
  it('can read the routes.txt into JSON format', function(done) {
    var rfs = fs.createReadStream('./gtfs/routes.txt');
    var converter = new Converter({ constructResult: true });
    converter.on('end_parsed', function(jsonObj) {
      assert.ok(jsonObj);
      done();
      // Console.log(jsonObj); // Here is your result json object
    });
    // Read from file
    rfs.pipe(converter);
  });
});
