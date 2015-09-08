var koa = require('koa'),
    app = module.exports = koa(),
    routes = require('koa-route'),
    port = normalizePort(process.env.PORT || '3000'),
    routing = require('../app.js'),
    parser = require('../parser.js'),
    scheduler = require('../schedule.js');  //Start the Muni.org parser.

//Schedule jobs to run against muni live data.
scheduler.schedulejob(parser.stopsdepartures);

//Routing
app.use(routes.get("/", routing.getDefault));
//app.use(routes.get("/stops", routing.getStopsDepartures));

app.listen(port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function log(msg) {
  console.log(msg);
}
