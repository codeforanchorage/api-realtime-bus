var app = require('./../bin/www.js');
var request = require('supertest').agent(app.listen());
var ProtoBuf = require('protobufjs');

describe('Default Page', function() {
  it('Fetch the root page.', function(done) {
    request
      .get('/')
      .expect(200) //Status 200.
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });
});

describe('GTFS feed', function() {
  it('Fetch and decode the GTFS object.', function(done) {

    //var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
    var transit = ProtoBuf.protoFromFile('gtfs-realtime.proto').build('transit_realtime');

    function binaryParser(res, callback) {
      res.data = [];
      res.on('data', function(chunk) {
        res.data = chunk;
      });

      res.on('end', function() {

        var builder = ProtoBuf.loadProtoFile('./json.proto');
        var root = builder.build('js');
        var obj = new root.Component();

        root.Component.decode(res.data);

        //console.log(res.data);
        // merge the data to one buffer, since it's in a list
        //data = Buffer.concat(data);

        // create a FeedMessage object by decooding the data with the protobuf object
        //var msg = transit.TimeRange.decode(res.data[0]);

        // do whatever with the object
        //console.log(msg);
      });
    }

    request
      .get('/feedtest')
      .expect(200) //Status 200.
      .parse(binaryParser)
      .end(function(err, res) {
        if (err) return done(err);
        if (!err && res.statusCode == 200) {

          console.log('Response Content-Type: ' + res.get('Content-Type'));
          console.log('Response Content-Length: ' + res.get('Content-Length'));

          //console.log(res);

          //var rslt = transit.TimeRange.decode(Buffer.concat(res.body));

          //console.log(rslt);

          done();
        }
      });

  });
});

/*
function binaryParser(res, callback) {
    res.setEncoding('binary');

    res.data = '';
    res.on('data', function (chunk) {
        console.log(({}).toString.call(chunk).match(/\s([a-zA-Z]+)/)[1].toLowerCase());
        res.data = res.data + chunk;
    });
    res.on('end', function () {
        callback(null, new Buffer(res.data));
    });
};
*/
