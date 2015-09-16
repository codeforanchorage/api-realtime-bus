var ProtoBuf = require('protobufjs');
var assert = require('assert');

describe('ProtoBufJS (.proto processing)', function() {
  it('can encode and decode a TimeRange GTFS object', function() {

    //Load test proto instance.
    var builder = ProtoBuf.loadProtoFile('./gtfs-realtime.proto');
    var root = builder.build('transit_realtime');
    var obj = new root.TimeRange();

    //Set values (pass validation)
    obj.start = 1;
    obj.end = 2;

    var rslt = root.TimeRange.decode(obj.encode());

    assert.equal(rslt.start.low, 1, 'Expected start value of 1 in TimeRange instance.');

  });
});

describe('ProtoBufJS (.proto processing)', function() {
  it('can create an encoded FeedMessage gtfs object', function(done) {
    var transit = ProtoBuf.protoFromFile('./gtfs-realtime.proto').build('transit_realtime');
    var fm = new transit.FeedMessage();
    var fh = new transit.FeedHeader();
    var fe = new transit.FeedEntity();

    //Fill with sample data (Pass validation rules)
    fh.gtfs_realtime_version = '1';
    fh.incrementality = '0';
    fh.timestamp = '2';
    fm.header = fh;
    fe.id = '1';
    fm.entity = fe;

    try {
      fm.encode();
    } catch (ex) {
      throw ex;
    } finally {
      done();
    };

  });
});
