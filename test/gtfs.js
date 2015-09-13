var ProtoBuf = require('protobufjs');
var assert = require('assert');

describe('ProtoBuf encoding', function() {
  it('can encode .proto format into a Buffer', function() {
    //this.timeout(5000);

    //Load test proto instance.
    var builder = ProtoBuf.loadProtoFile('./json.proto');
    var root = builder.build('js');
    var obj = new root.Component();

    //Populate, pass enough to get by validation.
    obj.id = '1';
    obj.name = 'Muni.org';
    obj.version = '1';

    //Encode .proto into binary array.
    var foo = new Buffer(obj.encode().buffer, 'binary');
    assert(foo.length > 0, 'The .proto buffer is empty!');

  });
});

describe('ProtoBuf encoding', function() {
  it('can decode binary Buffer into .proto instance', function() {

    //Load test proto instance.
    var builder = ProtoBuf.loadProtoFile('./gtfs-realtime.proto');
    var root = builder.build('transit_realtime');
    var obj = new root.TimeRange();

    //Set values, pass validation.
    obj.start = 1;
    obj.end = 2;

    //console.log('Encoding Instance: ' + obj.encode());

    var rslt = root.TimeRange.decode(obj.encode());

    assert.equal(rslt.start.low, 1, 'Expected value for start of timerange!');

  });
});
