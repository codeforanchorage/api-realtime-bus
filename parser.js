
var assert = require('assert');
var http = require('http');
var q = require('q');
var parseString = require('xml2js').parseString;

//Fetches all stops & depatures, return an Obj array
function fetchStopsDepartures() {
  var options = {
    host:'bustracker.muni.org',
    path:'/InfoPoint/XML/stopdepartures.xml',
    agent: false,
    headers:{'Cache-Control':'no-cache'},
  };
  var d = q.defer();

  // Grab feed, parse results.
  http.get(options, parse);

  // process the feed
  function parse(res) {
    var data = '';
    res.on('data', function(chunk) {
      data = data + chunk;
    });

    res.on('end', function() {
      parseString(data, function(err, result) {
        d.resolve({
          time:result.departures.generated[0]._,
          data:result,
        });
      });
    });
  };

  return d.promise;

};

module.exports.stopsdepartures = fetchStopsDepartures;
