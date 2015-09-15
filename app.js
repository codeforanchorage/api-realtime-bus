
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('192.168.59.103/Realtime');
var oneTable = wrap(db.get('one'));
var ProtoBuf = require('protobufjs');

//Send default page.
module.exports.getDefault = function * getDefault() {
  this.body = 'Muni of Anchorage realtime bus api default page.';
  this.status = 200;
};

module.exports.getGTFSMessage = function * getGTFSMessage() {
  var transit = ProtoBuf.protoFromFile('gtfs-realtime.proto').build('transit_realtime');

  //Create dependent objects.
  var fm = new transit.FeedMessage();
  var fh = new transit.FeedHeader();
  var fe = new transit.FeedEntity();

  //Fill up sample object.
  fh.gtfs_realtime_version = '1';
  fh.incrementality = '0';
  fh.timestamp = '2';
  fm.header = fh;
  fe.id = '1';
  fm.entity = fe;

  //Send back message buffer.
  this.body = fm.encode().buffer;
  this.set('content-type', 'application/grtfeed');
  this.status = 200;

};

//Send test feed.
module.exports.getTestMessage = function * getFeed() {

  //Load test proto instance.
  var builder = ProtoBuf.loadProtoFile('./json.proto');
  var root = builder.build('js');
  var obj = new root.Component();

  //Populate, pass enough to get by validation.
  obj.id = '1';
  obj.name = 'Muni.org';
  obj.version = '1';

  //Setup the response buffer.
  this.body = obj.encode().buffer;
  this.set('content-type', 'application/grtfeed');
  this.status = 200;

};
