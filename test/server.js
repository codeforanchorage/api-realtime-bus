'use strict';

var http = require('http');
var assert = require('assert');
var ProtoBuf = require('protobufjs');
var parseString = require('xml2js').parseString;

// Supertest Web App
var app = require('./../bin/www.js');
var request = require('supertest').agent(app.listen(3001));

describe.skip('GET', function() {
  it('can retrieve a root web response', function(done) {
    request
      .get('/')
      .expect(200) // Status 200.
      .end(function(err, res) {
        if (err) { throw err };
        done();
      });
  });
});

describe.skip('GET', function() {
  it('can retrieve a binary from /gtfsmessage, decode it into a FeedMessage',
  function(done) {
    var http = require('http');
    var transit = ProtoBuf.protoFromFile('./gtfs-realtime.proto')
        .build('transit_realtime');
    var options = {
      host: 'localhost',
      path: '/gtfsmessage?dt=' + (new Date()).getTime(),
      port: '3000',
      agent: false,
      headers: { 'Cache-Control': 'no-cache' },
    };

    // HTTP GET the binary feed
    http.get(options, parse);

    // Process the feed
    function parse(res) {
        // Gather the data chunks into a list
        var data = [];

        res.on('data', function(chunk) {
          data.push(chunk);
        });

        res.on('end', function() {
          // Merge the data to one buffer, since it's in a list
          data = Buffer.concat(data);

          // Create a FeedMessage object decode the data with the protobuf
          var msg = transit.FeedMessage.decode(data);
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
          assert.equal(msg.header.gtfs_realtime_version, 1,
            'The message header did not equal 1');

          // Decoding worked.
          done();
        });
      };
  });
});

describe.skip('GET', function() {
  it('can download a binary from /testmessage, and decode into Component',
  function(done) {
    var http = require('http');
    var builder = ProtoBuf.loadProtoFile('./json.proto');
    var root = builder.build('js');
    var options = {
      host: 'localhost',
      path: '/testmessage?dt=' + (new Date()).getTime(),
      port: '3000',
      agent: false,
      headers: { 'Cache-Control': 'no-cache' },
    };

    // HTTP GET the binary feed
    http.get(options, parse);

    // Process the feed
    function parse(res) {
        // Gather the data chunks into a list
        var data = [];
        res.on('data', function(chunk) {
          data.push(chunk);
        });

        res.on('end', function() {
          // Merge the data to one buffer, since it's in a list
          data = Buffer.concat(data);

          // Create a FeedMessage object by decooding the data with the protobuf
          var msg = root.Component.decode(data);

          // Decoding worked.
          done();
        });
      };

  });
});
