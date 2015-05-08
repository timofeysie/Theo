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
			var jpg = url.indexOf('.jpg');
			if (jpg == -1) {
				jpg = url.indexOf('.jpeg');
			}
			var name = url.slice(url.indexOf('/thumb/')+6,jpg+4);
			var image = 'http:'+base+name;
		}
		return image;
	}
}