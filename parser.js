
var request = require('request');
var parseString = require('xml2js').parseString;

//Fetches all stops & depatures, return an Obj array
function fetchStopsDepartures(done) {

  var options = {
    url: 'http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml',
    headers: { 'User-Agent': 'request' },
  };

  var options = {
    host:'bustracker.muni.org',
    path:'/InfoPoint/XML/stopdepartures.xml',
    port: '3000',
    agent: false,
    headers:{'Cache-Control':'no-cache'},
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log("Finished Fetching.");

      //Parse the XML into an Object.
      parseString(response.body, function(err, result) {

        //var jason = JSON.parse(result);
        console.log('bustracker xml feed updated: ' + result.departures.generated[0]._);

        //return JSON.parse(result);
        return result;

        done();

      });
    };
  });

};

module.exports.stopsdepartures = fetchStopsDepartures;
