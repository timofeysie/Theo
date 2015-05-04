### Ebor is the name of the tree in front of my house

## The Game

Brief: an art game where a team of players must guess the artist who painted a picture.
1. Provide a choice of the artist category to play.  We will use this list of lists:
http://en.wikipedia.org/wiki/Category:Artists_by_period
Initially, we can start with one game, Painters:
http://en.wikipedia.org/wiki/List_of_painters_by_name
These pages are separated by artists by name, so we could have to assemble a list by hand using Cheerio or with the WikiMedia API using nodemw

## WIP

Using Cheeio to parse the Wikidata we get a map fo the table rows and look at each row which goes in order of thumb url, title, size, location and nation, give or take a few of these.
Currently we get the following results for Vincent:
number of paintings :3672
number added        :922
And for Paul:
number of paintings :1133
number added        :205

Not perfect, but given that loading times are a problem, this issue should be handled with pagination or some such mechanism.


## The AngularJS APP (Not working)
in the eobr dirdctory, run the app with this command:
$ gulp connect
It should be available at:
https://ebor-timofeysie.c9.io/ebor/app/index.html
But it's not.  Not sure how Gulp will deal with Cloud9 configuration...
How can we let the node server.js command also launch the angular app?


## Node WikiMedia (nodewm)

We want to get a list of artists from this url:
http://en.wikipedia.org/wiki/List_of_modern_artists

The options in nodewm/examples/pagesInCategory.js has three options:
		server: 'en.wikipedia.org',
		path: '/w'
client.getPagesInCategory('Bosons', ...

		server: 'en.wikipedia.org',
		path: '/w'
client.getPagesInCategory('Bosons', ...

Using these options:
path: '/wiki'
client.getPagesInCategory('List of modern artists'

Gives us this error:
errors Error: Request to API failed: HTTP status code was 404

So our request is flawed.

List_of_modern_artists as the first argument also gives the the same error.

Server is the same.
path should be: /wiki ???
'Bosons' should be what?


## Running the server

1) Open `server.js` and start the app by clicking on the "Run" button in the top menu or launch the app from the Terminal:
`$ node server.js`
https://ebor-timofeysie.c9.io/ 
https://ebor-timofeysie.c9.io/scrape  Scrape the web page and save a file.
https://ebor-timofeysie.c9.io/list    Show the list of paintings and links.
https://ebor-timofeysie.c9.io/post-impressionists/vincent


## Parsing Wikidata

We are trying to get a list of painting thumbnails, titles and dates.
This is the format of a painting entry from the page:
http://en.wikipedia.org/wiki/List_of_works_by_Vincent_van_Gogh

<tr>
	<td>
		<a href="/wiki/File:Woman_with_White_Shawl_in_a_Wood.jpg" 
			class="image">
			<img alt="Woman with White Shawl in a Wood.jpg" 
				src="//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/100px-Woman_with_White_Shawl_in_a_Wood.jpg" 
				width="100" 
				height="150" 
				srcset="//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/150px-Woman_with_White_Shawl_in_a_Wood.jpg 1.5x, 
				//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/200px-Woman_with_White_Shawl_in_a_Wood.jpg 2x" data-file-width="435" data-file-height="651" />
		</a>
	</td>
	<td><i>Woman with White Shawl</i></td>
	<td>1882</td>
	<td>Teheran, Collection A. Farmanformaian (F949)</td>
</tr>

What we want to get out of it:

{
    "painting": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/100px-Woman_with_White_Shawl_in_a_Wood.jpg
",
    "release": "1882",
    "title": "Woman with White Shawl"
}

node-web-scraper
================

## Usage

$ node server.js <-- start the program

https://ebor-timofeysie.c9.io/#scrape  Scrape the web page and save a file.
https://ebor-timofeysie.c9.io/#list  Show the list of paintings and links.

or

http://localhost:8081/scrape

## Parsing Wikidata

This is the format of a painting entry from the page http://en.wikipedia.org/wiki/List_of_works_by_Vincent_van_Gogh
<tr>
	<td>
		<a href="/wiki/File:Woman_with_White_Shawl_in_a_Wood.jpg" 
			class="image">
			<img alt="Woman with White Shawl in a Wood.jpg" 
				src="//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/100px-Woman_with_White_Shawl_in_a_Wood.jpg" 
				width="100" 
				height="150" 
				srcset="//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/150px-Woman_with_White_Shawl_in_a_Wood.jpg 1.5x, 
				//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/200px-Woman_with_White_Shawl_in_a_Wood.jpg 2x" data-file-width="435" data-file-height="651" />
		</a>
	</td>
	<td><i>Woman with White Shawl</i></td>
	<td>1882</td>
	<td>Teheran, Collection A. Farmanformaian (F949)</td>
</tr>

What we want to get out of it:
//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/100px-Woman_with_White_Shawl_in_a_Wood.jpg

{
    "painting": "//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Woman_with_White_Shawl_in_a_Wood.jpg/100px-Woman_with_White_Shawl_in_a_Wood.jpg
",
    "release": "1882",
    "title": "Woman with White Shawl"
}



<tr>
	<td><a href="/wiki/File:Van_Gogh_-_K%C3%BChe_(nach_Jordaens).jpeg" 
		class="image">
		<img alt="Van Gogh - Kühe (nach Jordaens).jpeg" 
		src="//upload.wikimedia.org/wikipedia/commons/thumb/4/47/Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg/100px-Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg" 
		width="100" height="80" 
		srcset="//upload.wikimedia.org/wikipedia/commons/thumb/4/47/Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg/150px-Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/4/47/Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg/200px-Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg 2x" 
		data-file-width="3876" 
		data-file-height="3102" /></a></td>
	<td>
		<i>
			<a href="/wiki/Copies_by_Vincent_van_Gogh#Copy_after_Jacob_Jordaens" 
				title="Copies by Vincent van Gogh">
				Cows (after Jordaens)</a>
		</i>
	</td>
	<td>1890</td>
	<td>
		<a href="/wiki/Palais_des_Beaux-Arts_de_Lille" 
		title="Palais des Beaux-Arts de Lille">
		Palais des Beaux-Arts de Lille</a>, Lille, France (F822)
	</td>
</tr>


## Turning a thumb into a full sized image:

If we have a URL, we can compare that to a link to the full sized image:
http://upload.wikimedia.org/wikipedia/commons/1/1e/Still_Life_with_Cabbage_and_Clogs.jpg
http://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Still_Life_with_Cabbage_and_Clogs.jpg/100px-Still_Life_with_Cabbage_and_Clogs.jpg

Let's break that down:

Full sized url:
http://upload.wikimedia.org/wikipedia/commons
/1/1e/
Still_Life_with_Cabbage_and_Clogs.jpg

Thumb url:
http://upload.wikimedia.org/wikipedia/commons
/thumb/1/1e/
Still_Life_with_Cabbage_and_Clogs.jpg
/100px-Still_Life_with_Cabbage_and_Clogs.jpg

Compare those to another example:
http://upload.wikimedia.org/wikipedia/commons
/thumb/c/c8/
An_Old_Man_Putting_Dry_Rice_on_the_Hearth_1881_Vincent_van_Gogh.jpg
/100px-An_Old_Man_Putting_Dry_Rice_on_the_Hearth_1881_Vincent_van_Gogh.jpg

These are the elements:
base: http://upload.wikimedia.org/wikipedia/commons
section: /c/c8/
remove: /thumb/
title: An_Old_Man_Putting_Dry_Rice_on_the_Hearth_1881_Vincent_van_Gogh.jpg

So take the base, find the section, remove the /thumb/ and add the single title before the /100px- and we will get:

full-url: http://upload.wikimedia.org/wikipedia/commons/c/c8/An_Old_Man_Putting_Dry_Rice_on_the_Hearth_1881_Vincent_van_Gogh.jpg

There, no parsing of single pages needed.

base //upload.wikimedia.org/wikipedia/commons
name /d/dc/WLANL_-_artanonymous_-_View_of_Auvers.jpg


## WIP (Work In Progress)
Currently we have the painting (thumb & large image url) and the title from the alt tag.
We are getting a good list of paintings, but many are being missed.  
number of paintings :907
number added        :311
For example:

<tr>
    <td><a href="/wiki/File:Van_Gogh_-_K%C3%BChe_(nach_Jordaens).jpeg" class="image"><img alt="Van Gogh - Kühe (nach Jordaens).jpeg" src="//upload.wikimedia.org/wikipedia/commons/thumb/4/47/Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg/100px-Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg" width="100" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/4/47/Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg/150px-Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/4/47/Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg/200px-Van_Gogh_-_K%C3%BChe_%28nach_Jordaens%29.jpeg 2x" data-file-width="3876" data-file-height="3102" /></a></td>
    <td><i><a href="/wiki/Copies_by_Vincent_van_Gogh#Copy_after_Jacob_Jordaens" title="Copies by Vincent van Gogh">Cows (after Jordaens)</a></i></td>
    <td>1890</td>
    <td><a href="/wiki/Palais_des_Beaux-Arts_de_Lille" title="Palais des Beaux-Arts de Lille">Palais des Beaux-Arts de Lille</a>, Lille, France (F822)</td>
</tr>

Also, we need to get the date and the location of the work if possible.

The list function returns the following error:
TypeError: Object #<ServerResponse> has no method 'sendFile'
...Pronab+> can you try 'sendfile'  in the code in server.js line 60 ?



## The Chat Code

This chat example showcases how to use `socket.io` with a static `express` server.
As you enter your name, watch the Users list (on the left) update. Once you press Enter or Send, the message is shared with all connected clients.

