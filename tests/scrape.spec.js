describe('scrape test',function(){

var request = require('request');

it("should respond to a call to /scrape", function(done) {
  request("http://localhost:3000/scrape", 
  	function(error, response, body) {
    	expect(body).toBeDefined();
    	done();
  });
}, 7000); // timeout after 250 ms

it("should respond parse a table row for image info", function(done) {
  request("http://localhost:3000/scrape/test", 
  	function(error, response, body) {
    	expect(body).toBeDefined();
    	done();
  });
}, 6000); // timeout after 250 ms

});