var app = require('./../bin/www.js');
var request = require('supertest').agent(app.listen(3001));
var ProtoBuf = require('protobufjs');

describe.skip('Ping pong', function() {
  it('can fetch the root page of the node server.', function(done) {
    request
      .get('/')
      .expect(200) //Status 200.
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });
});

describe.skip('Webclient', function() {
  it('can fetch and decode the a .proto object served up by node.', function(done) {

    var http = require('http');

    var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
    var request = require('request');

    var requestSettings = {
      method: 'GET',
      url: 'http://localhost:3000/feedtest',
      encoding: null,
    };

    //request(requestSettings, function(error, response, body) {
      //console.log('Response Content-Type: ' + response.get('Content-Type'));
      //console.log('Response Content-Length: ' + response.get('Content-Length'));

      //console.log(body);

    //  if (!error && response.statusCode == 200) {
    //    var feed = GtfsRealtimeBindings.TimeRange.decode(body);
  //      console.log(feed);

        // feed.entity.forEach(function(entity) {
        //   if (entity.trip_update) {
        //     console.log(entity.trip_update);
        //   }
        // });
    //  }
  //  });

    //var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
    var transit = ProtoBuf.protoFromFile('gtfs-realtime.proto').build('transit_realtime');

    // HTTP GET the binary feed
    http.get('http://localhost:3000/feedtest', parse);
    //http.get('http://developer.trimet.org/ws/V1/FeedSpecAlerts/?appID=618F30BB3062F39AF24AED9EC', parse);

    // process the feed
    function parse(res) {
        // gather the data chunks into a list
        var data = '';

        // res.on('data', function(chunk) {
        //   data.push(chunk);
        // });
        //
        // res.on('end', function() {
        //   // merge the data to one buffer, since it's in a list
        //   data = Buffer.concat(data);
        //
        //   // create a FeedMessage object by decooding the data with the protobuf object
        //   var msg = transit.TimeRange.decode(data);
        //
        //   // do whatever with the object
        //   console.log(msg);
        // });

        res.on('data', function(chunk) {
          data = data + (chunk);
        }).on('end', function() {
          //at this point data is an array of Buffers
          //so we take each octet in each of the buffers
          //and combine them into one big octet array to pass to a
          //new buffer instance constructor
          // var buffer = new Buffer(data.reduce(function(prev, current) {
          //   return prev.concat(Array.prototype.slice.call(current));
          // }, []));
          //
          // console.log(buffer);

          //console.log(({}).toString.call(buffer).match(/\s([a-zA-Z]+)/)[1].toLowerCase());
          var rslt = transit.TimeRange.decode64(data);
          console.log(rslt);
          done();
        });
      };

    // function binaryParser(res, callback) {
    //   res.data = [];
    //   res.on('data', function(chunk) {
    //     res.data = chunk;
    //   });
    //
    //   res.on('end', function() {
    //
    //     var builder = ProtoBuf.loadProtoFile('./json.proto');
    //     var root = builder.build('js');
    //     var obj = new root.Component();
    //
    //     root.Component.decode(res.data);
    //
    //     //console.log(res.data);
    //     // merge the data to one buffer, since it's in a list
    //     //data = Buffer.concat(data);
    //
    //     // create a FeedMessage object by decooding the data with the protobuf object
    //     //var msg = transit.TimeRange.decode(res.data[0]);
    //
    //     // do whatever with the object
    //     //console.log(msg);
    //   });
    // }

    // request
    //   .get('/feedtest')
    //   .expect(200) //Status 200.
    //   .parse(binaryParser)
    //   .end(function(err, res) {
    //     if (err) return done(err);
    //     if (!err && res.statusCode == 200) {
    //
    //       console.log('Response Content-Type: ' + res.get('Content-Type'));
    //       console.log('Response Content-Length: ' + res.get('Content-Length'));
    //
    //       //console.log(res);
    //
    //       //var rslt = transit.TimeRange.decode(Buffer.concat(res.body));
    //
    //       //console.log(rslt);
    //
    //       done();
    //     }
    //   });

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
