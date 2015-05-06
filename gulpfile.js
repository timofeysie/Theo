var gulp = require('gulp');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = '.';
var LIVERELOAD_PORT = 35729;

function startExpress() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
}
 
var lr;
function startLivereload() {
  lr = require('tiny-lr')();
  lr.listen(LIVERELOAD_PORT);
  // go to http://localhost:35729 and 
  //you'll get a warm JSON welcome from tiny-lr.
}

// Notifies livereload of changes detected by gulp watch 
function notifyLivereload(event) {
  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);
  lr.changed({
    body: {
      files: [fileName]
    }
  });
}


gulp.task('default', function () {
  startExpress();
  startLivereload();
  gulp.watch('*.js', notifyLivereload);
  console.log('Gulp and running!')
});