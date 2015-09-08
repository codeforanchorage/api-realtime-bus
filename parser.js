
var request = require('request'),
    parseString = require('xml2js').parseString;

//Fetches all stops & depatures, return an Obj array
function fetchStopsDepartures () {

    console.log('stopsdepartures');

    var options = {
        url: 'http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml',
        headers: { 'User-Agent': 'request' }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log("Finished Fetching.");

        //Parse the XML into an Object.
        parseString(response.body, function (err, result) {

          //var jason = JSON.parse(result);
          console.log('bustracker xml feed updated: ' + result.departures.generated[0]._);

          //return JSON.parse(result);
          return result;

        });
      };
    });

};

module.exports.stopsdepartures = fetchStopsDepartures;
