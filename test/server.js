var app = require('./../bin/www.js');
var request = require('supertest').agent(app.listen(3001));
var ProtoBuf = require('protobufjs');
var http = require('http');
var assert = require('assert');

describe('GET Request to /', function() {
  it('can retrieve a root webpage from the server', function(done) {
    request
      .get('/')
      .expect(200) //Status 200.
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });
});

describe('GET Request to /gtfsmessage', function() {
  it('can download a binary object, and decode it into a FeedMessage', function(done) {
    var http = require('http');
    var transit = ProtoBuf.protoFromFile('./gtfs-realtime.proto').build('transit_realtime');
    var feedUrl = 'http://localhost:3000/gtfsmessage';

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

          // create a FeedMessage object by decooding the data with the protobuf object
          var msg = transit.FeedMessage.decode(data);
          assert.equal(msg.header.gtfs_realtime_version, 1, 'The message header did not equal 1');

          // Decoding worked.
          done();
        });
      };
  });
});

describe('GET Request to /testmessage', function() {
  it('can download a local .proto binary object, and decode it a Component', function(done) {
    var http = require('http');
    var builder = ProtoBuf.loadProtoFile('./json.proto');
    var root = builder.build('js');
    var feedUrl = 'http://localhost:3000/testmessage';

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

          // create a FeedMessage object by decooding the data with the protobuf object
          var msg = root.Component.decode(data);

          // Decoding worked.
          done();
        });
      };

  });
});
