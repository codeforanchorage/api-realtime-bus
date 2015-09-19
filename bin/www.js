var koa = require('koa');
var app = module.exports = koa();
var routes = require('koa-route');
var port = normalizePort(process.env.PORT || '3000');
var routing = require('../app.js');
var parser = require('../parser.js');
var scheduler = require('../schedule.js'); // Start the Muni.org parser.

// Schedule jobs to run against muni live data.
// scheduler.schedulejob(parser.stopsdepartures);

// Routing
app.use(routes.get('/', routing.getDefault));
app.use(routes.get('/testmessage', routing.getTestMessage));
app.use(routes.get('/gtfsmessage', routing.getGTFSMessage));

app.on('error', function(err) {
  log.error('nodejs server error: ', err);
});

// Listening
app.listen(port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // Named pipe
    return val;
  }

  if (port >= 0) {
    // Port number
    return port;
  }

  return false;
}

function log(msg) {
  console.log(msg);
}
