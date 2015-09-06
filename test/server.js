//var assert = require("assert");

var app = require('./../app.js');
var request = require("supertest").agent(app.listen());

describe("Default Page", function() {
  it("Fetch the root page.", function(done) {
    request
      .get('/')
      .expect(200) //Status 200.
      .end(function(err, res){
        if (err) throw err;
        done();
      });
  });
});
