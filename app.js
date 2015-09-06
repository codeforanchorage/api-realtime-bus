var koa = require("koa"), app = module.exports = koa(), routes =
require("koa-route"), parse = require("co-body"), monk = require("monk"), wrap =
require("co-monk"), db = monk("192.168.59.103/Realtime"), oneTable =
wrap(db.get("one")), request = require('koa-request'),
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

function * getStopsDepartures() {

    var options = {
        url: 'http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml',
        headers: { 'User-Agent': 'request' }
    };

    var _self = this;

    var response = yield request(options);
    //var info = JSON.parse(response.body);

    parseString(response.body, function (err, result) {

      //var jason = JSON.parse(result);

      var last = result.departures.generated[0]._;

      console.log(new Date(last));
      console.log(last);

      _self.body = "All";
      _self.status = 200;

    });

};
