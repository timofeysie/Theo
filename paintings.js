var cheerio = require('cheerio');
module.exports = {

	getPainting: function(i, element, img) {
		//console.log('i '+i);
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
			
			//console.log(i+' date '+date);
			// get Large Url
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
			//console.log('largeUrl '+largeUrl);
			var painting = {}
			painting.title = title;
			painting.url = 'http:'+url;
			painting.largeUrl = largeUrl;
		}
		return painting;
	},
	getImage: function(url) {
		if (url) {
			// get Large Url
			var thumb = url.indexOf('/thumb/');
			var base = url.slice(0, thumb);
			var name = url.slice(url.indexOf('/thumb/')+6,url.indexOf('.jpg')+4);
			console.log('length '+url.length);
			console.log('base:'+base);
			console.log('name:'+name);
			var image = 'http:'+base+name;
		}
		return image;
	}
}