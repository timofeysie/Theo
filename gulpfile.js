var gulp = require('gulp');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var server = require('gulp-develop-server');
 
 // run server 
gulp.task( 'server:start', function() {
    server.listen( { path: './server.js' } );
});
 
// restart server if app.js changed 
gulp.task( 'server:restart', function() {
    gulp.watch( [ './server.js' ], server.restart );
});

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

gulp.task('default', ['server:start', 'server:restart', 'lint'],
  console.log('Gulp and running!')
);