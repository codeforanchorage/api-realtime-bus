
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
  //Load test proto instance.
  //var builder = ProtoBuf.loadProtoFile('./gtfs-realtime.proto');
  //var root = builder.build('transit_realtime');
  //var obj = new root.TimeRange();

  var builder = ProtoBuf.loadProtoFile('./json.proto');
  var root = builder.build('js');
  var obj = new root.Component();

  //Set values, pass validation.
  obj.id = '1';
  obj.name = 'Muni.org';
  obj.version = '1';

  //console.log('Object' + obj);
  //console.log('Sending:' + obj.encode());
  //console.log('Sending length: ' + obj.encode().buffer.length);

  //Setup the response
  this.body = obj.encode();
  this.status = 200;
};
