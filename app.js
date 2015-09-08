
var parse = require("co-body"),
    monk = require("monk"),
    wrap = require("co-monk"),
    db = monk("192.168.59.103/Realtime"),
    oneTable = wrap(db.get("one"));

//Set default page.
module.exports.getDefault = function * getDefault() {
  this.body = "Muni of Anchorage realtime bus api default page.";
  this.status = 200;
};

function log(msg) {
    console.log(msg);
}
