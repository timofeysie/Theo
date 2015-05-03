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
var paul = 'Paul Cézanne';
//var vincent = 'Vincent Van Gogh';
var artist = paul;
//var artist = vincent;
var sections = artist.split(' ');
var filename = sections[0].toLowerCase();

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

router.get('/scrape', function(req, res){
	url = 'http://en.wikipedia.org/wiki/List_of_works_by_Vincent_van_Gogh';
	request(url, function(error, response, html){ 	
	  // url and callback retuning parameters w html
		if (!error){
			var $ = cheerio.load(html);
			var paintings = [];
			 // we need to match <td> <a <img src=*** thumb url ***
			$('img').each(function(i, element) {
        painting = tools.getPainting(i, element, $(this));
      	if (painting) { 
	      	paintings.push(painting);
	    }
    	});
		}
		fs.writeFile('vincent.json', JSON.stringify(paintings, null, 4), function(err){
        	console.log('File successfully written in output.json file');
        })
        res.send('Check your console!')
	})
});

router.get('/scrape2', 
	function(req, res) {
		//vincentsUrl = 'http://en.wikipedia.org/wiki/List_of_works_by_Vincent_van_Gogh';
		paulsUrl = 'http://en.wikipedia.org/wiki/List_of_paintings_by_Paul_C%C3%A9zanne';
		request(paulsUrl, function(error, response, html) { 	
		    var addedCount = 0;
		    var fullCount = 0;
		    console.log('Start parse');
			if (!error) {
				var $ = cheerio.load(html);
				var paintings = [];
				var objectMark = 0;
				var size;
					var thumb;
					var image;
					var date;
					var title;
				$('td').map(function(i, td) {
					fullCount++;
					var painting = {}
					
					td = $(td)
					var text = td.text();
					switch(objectMark) {
					    case 1:
					        painting.title = text;
					        title = text;
					        objectMark++;
					        break;
					    case 2:
					        painting.date = text;
					        date = text;
					        objectMark++;
					        break;
					    case 3:
					    	painting.size = text;
					    	painting.title = title;
					    	painting.date = date;
					    	painting.thumb = thumb;
					    	painting.image = image;
					    	paintings.push(painting);

					        //console.log('size '+size+'---------'+objectMark);
					    	//console.log('title '+title);
					    	//console.log('date '+date);
					    	//console.log('thumb '+thumb);
					    	//console.log('image '+image);
					        objectMark++;
					    	break;
					    case 4:
					        objectMark++;
					    case 5:
					        objectMark = 0;
					    	break;
					    default:
					    	break;
					}	
					//cmust be an image tag
					if (text == '' || text == undefined || text == null) {
					    addedCount++;
						painting.thumb = td.children('a').children('img').attr('src');
						painting.image = tools.getImage(painting.thumb);
						thumb = 'http:'+painting.thumb;
						image = painting.image;
						objectMark++;
					}
				});
	  		} else {
				console.log('There was an error'); 
	        }
	        fs.writeFile(filename+'.json', JSON.stringify(paintings, null, 4), function(err) {
	        	console.log('File successfully written.');
	        	console.log('number of paintings :'+fullCount);
	        	console.log('number added        :'+addedCount);
        	})
        	res.send(paintings);
	    });
	}
)

router.get('/list', function (request, response) {
	console.log('list called');
	response.sendFile('vincent.json');
})

router.get('/vincent', function (request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.setHeader('Content-Type', 'application/json');
  var file = fs.readFileSync('vincent.json');
  response.send(file);
})
// Enable CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
