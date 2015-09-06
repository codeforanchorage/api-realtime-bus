var koa = require("koa"),
    app = module.exports = koa(),
    routes = require("koa-route"),
    parse = require("co-body"),
    monk = require("monk"),
    wrap = require("co-monk"),
    db = monk("192.168.59.103/Realtime"),
    oneTable = wrap(db.get("one")),
    request = require('koa-request'),
    parseString = require('xml2js').parseString;

//Setup Routing
app.use(routes.get("/", getDefault));
app.use(routes.get("/stops", getStopsDepartures));

app.listen("3000");



//Set default page.
function * getDefault() {
  this.body = "Muni of Anchorage realtime bus api default page.";
  this.status = 200;
};

//Fetches all stops & depatures, returns as an Obj array
function *getStopsDepartures() {

    var options = {
        url: 'http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml',
        headers: { 'User-Agent': 'request' }
    },
    _self = this,
    response = yield request(options);

    //Check the request
    if (response.status = 200) {
      //Parse the XML into an Object.
      parseString(response.body, function (err, result) {
        //var jason = JSON.parse(result);
        //var last = result.departures.generated[0]._;
        _self.body = JSON.stringify(result);
        _self.status = 500;
      });
    } else {
        _self.status = 500;
    }
};

function log(msg) {
    console.log(msg);
}
