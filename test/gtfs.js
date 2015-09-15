var ProtoBuf = require('protobufjs');
var assert = require('assert');

describe.skip('ProtoBuf', function() {
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
    //var foo = new Buffer(obj.encode().buffer, 'binary');

    //assert(foo.length > 0, 'The .proto buffer is empty!');
    console.log(root.Component.decode(new Buffer(obj.encode(), 'binary')));

    //obj.decode(obj.encode());

  });
});

describe.skip('ProtoBuf', function() {
  it('can encode and decode .proto instance', function() {

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

describe('GTFS encoding', function() {
  it('can downloads an existing feed, and decodes it correctly.', function(done) {
    var ProtoBuf = require('protobufjs');
    var http = require('http');

    // create a protobuf decoder
    var transit = ProtoBuf.protoFromFile('gtfs-realtime.proto').build('transit_realtime');
    var builder = ProtoBuf.loadProtoFile('./json.proto');
    var root = builder.build('js');

    // your protobuf binary feed URL
    var feedUrl = 'http://developer.trimet.org/ws/V1/FeedSpecAlerts/?appID=618F30BB3062F39AF24AED9EC';
    feedUrl = 'http://localhost:3000/feedtest';

    // HTTP GET the binary feed
    http.get(feedUrl, parse);

    // process the feed
    function parse(res) {
        // gather the data chunks into a list
        var data = [];
        res.on('data', function(chunk) {
          data.push(chunk);
        });

        res.on('end', function() {
          // merge the data to one buffer, since it's in a list
          data = Buffer.concat(data);
          console.log(data.length);

          // create a FeedMessage object by decooding the data with the protobuf object
          var msg = root.Component.decode(data);
          
          done();
        });
      };

  });
});
