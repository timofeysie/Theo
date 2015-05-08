var cheerio = require('cheerio');
module.exports = {
	/* Old method which started with the src element*/
	getPainting: function(i, element, img) {
		var url = img.attr('src');
		if ((url.indexOf('//upload') != -1) && (url.indexOf('.jpg') != -1)) {
			var title = img.attr('alt');
			var vincent = 'Vincent van Gogh - ';
			var loc = title.indexOf(vincent);
			if (loc != -1) {
				title = title.slice(loc+vincent.length,title.length);
			}
			var jpg = title.indexOf('.jpg');
			if (jpg != -1) {
				title = title.slice(0,jpg)
			}
			var bracket = title.indexOf('(');
			if (bracket != -1) {
				title = title.slice(0,bracket)
			}
			title = title.replace(/[_0-9]+$/, '');
			var date = img.parent().next().next().first().text();
			var thumb = url.indexOf('/thumb/');
			var separ   = url.indexOf('/100px-');
			if (separ == -1) {
				separ = url.indexOf('/220px-');
			}
			if (separ == -1) {
				separ = url.indexOf('/80px-');
			}
			var base = url.slice(0, thumb);
			var name = url.slice(thumb+6,separ);
			var largeUrl = 'http:'+base+name;
			var painting = {}
			painting.title = title;
			painting.url = 'http:'+url;
			painting.largeUrl = largeUrl;
		}
		return painting;
	},
	/* Starting with the url for the thumb, we flollow the steps described in the README 
	titled 'Turning a thumb into a full sized image' to get the full sized image url.*/
	getImage: function(url) {
		if (url) {
			var thumb = url.indexOf('/thumb/');
			var base = url.slice(0, thumb);
			var name = url.slice(url.indexOf('/thumb/')+6,url.indexOf('.jpg')+4);
			var image = 'http:'+base+name;
		}
		return image;
	},
	scrapePainting: function(i, td, $) {
		console.log('scrapePainting:'+i+' '+td+' '+$);
		var objectMark = 0;
		var size;
		var thumb;
		var image;
		var date;
		var title;
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
		    	if (image == "http://upload.wikimedia.org/wikipedia/commons") {
		    		console.log('size '+painting.size+' problem image! --------');
		    		console.log('title '+painting.title);
		    		console.log('date '+painting.date);
		    		console.log('thumb '+painting.thumb);
		    		console.log('image '+painting.image);
		    	}
		        objectMark++;
		        return painting;
		    	break;
		    case 4:
		        objectMark++;
		    case 5:
		        objectMark = 0;
		    	break;
		    default:
		    	break;
		}	
		if (text == '' || text == undefined || text == null) {
		    //addedCount++;
			painting.thumb = td.children('a').children('img').attr('src');
			painting.image = this.getImage(painting.thumb);
			thumb = 'http:'+painting.thumb;
			image = painting.image;
			//objectMark++;
		}
	}

}