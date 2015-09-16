var http = require('http');
var assert = require('assert');
var ProtoBuf = require('protobufjs');
var parseString = require('xml2js').parseString;

// Supertest Web App
var app = require('./../bin/www.js');
var request = require('supertest').agent(app.listen(3001));

// Muni XML Feed Parser
var parser = require('./../parser');

describe('GET', function() {
  it('can retrieve a root web response', function(done) {
    request
      .get('/')
      .expect(200) //Status 200.
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });
});

describe('GET', function() {
  it('can retrieve JSON encoded Muni routes and departures from live xml feed', function(done) {
    this.timeout(10000);

    var options = {
      host:'bustracker.muni.org',
      path:'/InfoPoint/XML/stopdepartures.xml',

      //port: '3000',
      agent: false,
      headers:{'Cache-Control':'no-cache'},
    };

    // Grab feed, parse results.
    http.get(options, parse);

    // process the feed
    function parse(res) {
      var data = '';
      var timestamp = undefined;
      res.on('data', function(chunk) {
        data = data + chunk;
      });

      res.on('end', function() {
        parseString(data, function(err, result) {
          assert.equal(result.departures !== undefined, true);
          timestamp = result.departures.generated[0]._;
          done();
        });
      });
    };
  });
});

describe('GET', function() {
  it('can retrieve a binary object from /gtfsmessage, and decode it into a FeedMessage', function(done) {
    var http = require('http');
    var transit = ProtoBuf.protoFromFile('./gtfs-realtime.proto').build('transit_realtime');
    var options = {
      host:'localhost',
      path:'/gtfsmessage?dt=' + (new Date()).getTime(),
      port: '3000',
      agent: false,
      headers:{'Cache-Control':'no-cache'},
    };

    // HTTP GET the binary feed
    http.get(options, parse);

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

describe('GET', function() {
  it('can download a binary object from /testmessage, and decode it into a Component', function(done) {
    var http = require('http');
    var builder = ProtoBuf.loadProtoFile('./json.proto');
    var root = builder.build('js');
    var options = {
      host:'localhost',
      path:'/testmessage?dt=' + (new Date()).getTime(),
      port: '3000',
      agent: false,
      headers:{'Cache-Control':'no-cache'},
    };

    // HTTP GET the binary feed
    http.get(options, parse);

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
