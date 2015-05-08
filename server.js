// Socket.IO, Express, and Async.
var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io'); 
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var tools   = require('./paintings');
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
// artist information, the lists are curretnly generated one at a time
var postImpressionists = 'post-impressionists.json';
//var paul = 'Paul Cézanne';
//var paulsUrl = 'http://en.wikipedia.org/wiki/List_of_paintings_by_Paul_C%C3%A9zanne';
var vincent = 'Vincent Van Gogh';
var vincentsUrl = 'http://en.wikipedia.org/wiki/List_of_works_by_Vincent_van_Gogh';
//var odilon = "Odilon Redon";
//var odilonUrl = "http://en.wikipedia.org/wiki/Odilon_Redon";
//var artist = paul;
//var artist = vincent;
//var gauguinsUrl = 'http://en.wikipedia.org/wiki/List_of_paintings_by_Paul_Gauguin';
var artistUrl = vincentsUrl;
var artist = vincent; // the filename in the data dir will be the last name of the string set here
var sections = artist.split(' ');
var filename = sections[sections.length-1].toLowerCase(); // get the last name as file
console.log('writing file for '+filename);
router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

router.get('/scrape', 
	function(req, res) {
		request(artistUrl, function(error, response, html) {   
		    var addedCount = 0;
		    var fullCount = 0;
			if (!error) {
				var $ = cheerio.load(html);
				var paintings = [];
				$('td').map(function(i, td) {
					var painting = tools.scrapePainting(i, td, $);
					paintings.push(painting);
				});
	  		} else {
				  console.log('There was an error'); 
	      }
	        fs.writeFile('data/'+filename+'.json', JSON.stringify(paintings, null, 4), function(err) {
	        console.log('number of paintings :'+fullCount);
	        console.log('number added        :'+addedCount);
        })
        res.send(paintings);
	    });
	  }
)

router.get('/scrape/test', function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.setHeader('Content-Type', 'application/json');
  var file = fs.readFileSync('data/test.json');
	response.send(file);
})

router.get('/post-impressionists', function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.setHeader('Content-Type', 'application/json');
  var file = fs.readFileSync('data/post-impressionists.json');
	response.send(file);
})

// Enable CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// take a request for a particular painter
router.get('/post-impressionist/:painter', function (request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.setHeader('Content-Type', 'application/json');
  var painter = request.params.painter;
  console.log('painter '+painter);
  var file = fs.readFileSync('data/'+painter+'.json');
  response.send(file);
})

// Chat Functions /////////////////////
io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });
    sockets.push(socket);
    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });
    socket.on('message', function (msg) {
      var text = String(msg || '');
      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
