
var assert = require('assert');
var http = require('http');
var q = require('q');
var fs = require('fs');
var parseString = require('xml2js').parseString;

// Fetches all stops & depatures, return an Obj array
function fetchStopsDepartures() {
  var options = {
    host: 'bustracker.muni.org',
    path: '/InfoPoint/XML/stopdepartures.xml',
    agent: false,
    headers: { 'Cache-Control': 'no-cache' },
  };
  var d = q.defer();
  var sd = __dirname + '/stopdepartures.xml';

  if (fs.existsSync(sd)) {
    // Grab a local file, parse results.
    fs.readFile(sd, function(err, data) {
      if (err) { throw err; };
      parseString(data, function(err, result) {
        console.log('      Static data: ' + result.departures.generated[0]._);
        d.resolve({
          time: result.departures.generated[0]._,
          data: result,
        });
      });
    });
  } else {
    // Grab feed, parse results.
    http.get(options, parse);

    // Process the feed
    function parse(res) {
      var data = '';
      res.on('data', function(chunk) {
        data = data + chunk;
      });

      res.on('end', function() {
        parseString(data, function(err, result) {
          console.log('      Static data: ' + result.departures.generated[0]._);
          d.resolve({
            time: result.departures.generated[0]._,
            data: result,
          });
        });
      });
    };
  }

  return d.promise;

};

module.exports.stopsdepartures = fetchStopsDepartures;
