
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

//Send test feed.
module.exports.getFeedTest = function * getFeed() {
  //Load test proto instance.
  // var builder = ProtoBuf.loadProtoFile('./gtfs-realtime.proto');
  // var root = builder.build('transit_realtime');
  // var obj = new root.TimeRange();

  // var builder = ProtoBuf.loadProtoFile('./json.proto');
  // var root = builder.build('js');
  // var obj = new root.Component();

  //Set values, pass validation.
  //obj.id = '1';
  //obj.name = 'Muni.org';
  //obj.version = '1';
  //obj.start = 1;
  //obj.end = 2;

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
