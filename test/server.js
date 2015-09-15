var app = require('./../bin/www.js');
var request = require('supertest').agent(app.listen(3001));
var ProtoBuf = require('protobufjs');
var http = require('http');
var assert = require('assert');
var request = require('request');
var parser = require('./../parser');

describe('GET Request', function() {
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

describe('GET Request', function() {
  it('can download and encode the Muni routes and departures xml feed', function(done) {
    this.timeout(15000);

    var options = {
      url: 'http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml',
      headers: { 'User-Agent': 'request' },
    };

    var options = {
      host:'bustracker.muni.org',
      path:'/InfoPoint/XML/stopdepartures.xml',
      port: '3000',
      agent: false,
      headers:{'Cache-Control':'no-cache'},
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log("Finished Fetching.");
        //Parse the XML into an Object.
        parseString(response.body, function(err, result) {

          //var jason = JSON.parse(result);
          console.log('bustracker xml feed updated: ' + result.departures.generated[0]._);

          //return JSON.parse(result);
          return result;

          done();

        });
      };
    });
  });
});

describe('GET Request', function() {
  it('can download a binary object from /gtfsmessage, and decode it into a FeedMessage', function(done) {
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

describe('GET Request', function() {
  it('can download .proto binary object from /testmessage, and decode it a Component', function(done) {
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
