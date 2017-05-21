var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var bs = require('browser-sync').create();
var runSequence = require('run-sequence');
var clean = require('gulp-clean');

var port = 4000;

/**
 * Watches the angular app files
 * Calls any associated task upon change in these app files
 */
gulp.task('watch-angular-scripts', function () {
  return gulp.watch('public/app/**/*.js', ['minify-js']);
});

/**
 * Will listen to changes in the js files and restart the server.
 * For only the server resources
 */
gulp.task('nodemon', function (cb) {

  var started = false;

  return nodemon({
    script: 'index.js',
    ext: 'js',
    watch: ['routes/**/*.js', 'index.js'],
    ignore: ["public/*"]
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    if (!started) {
      started = true;
      cb();
    }
  });
});

/**
 * Watches all the less and runs the designated tasks upon change
 */
gulp.task('watch-less', function () {
  return gulp.watch(['public/assets/less/**/*.less'], ['less-to-css']);
});

/**
 * Watches all the css files and runs the designated tasks upon change
 */
gulp.task('watch-css', function () {
  return gulp.watch(['public/assets/css/*.css'], ['minify-css']);
});

/**
 * Watches the angular html files
 * Calls any associated task upon change in these html files
 */
gulp.task('watch-angular-templates', function () {
  return gulp.watch('templates/**/*.html', ['cache-angular-templates']);
});


/**
 * Start browser sync. Livereloads any changes in the angular app.
 * Listen to changes in the html and the minified/concatenated angular app
 */
gulp.task('browser-sync', function () {
  return bs.init(null, {
    proxy: "http://localhost:" + port,
    files: ["public"],
    browser: "google chrome",
    port: 7000,
    notify: true
  });
});

gulp.task('delete-build-files', function () {
  return gulp.src(['public/index.html', 'public/css/app.min.css',
      'public/assets/css/compiled.css', 'public/compiled.min.css', 'public/js/app.min.js',
      'public/js/templates.js', 'public/templates.js', 'public/app.min.*', 'public/app/config.js'
    ], {
      read: false
    })
    .pipe(clean());
});

/**
 * Watches all the html, css and less files and re runs minification
 */
gulp.task('watch-dev-assets', function () {
  gulp.watch(['templates/**/*.html'], ['cache-angular-templates']);
  return gulp.watch(['public/assets/css/*.css', 'public/js/templates.js',
    'public/compiled.min.css', 'public/app/**/*.js'
  ], ['minify-assets']);
});

/**
 * Starts the server via nodemon
 * Will listen to changes in the js files and restart the server.
 * It will also minify the files and simulate a production setup.
 * This mode will simulate a staging/production environment.
 */
gulp.task('dev', function (cb) {
  runSequence('delete-build-files', 'install-dependencies',
    'less-to-css', 'cache-angular-templates', 'minify-assets', ['watch-dev-assets',
      'watch-less', 'nodemon', 'browser-sync'
    ], cb);
});

/**
 * Starts the server via nodemon
 * Will listen to changes in the js files and restart the server.
 */
gulp.task('start', function (cb) {
  runSequence('delete-build-files', 'copy-index-html',
    'install-dependencies', 'less-to-css', 'cache-angular-templates', ['watch-angular-templates',
      'watch-less', 'watch-index-html', 'nodemon', 'browser-sync'
    ], cb);
});

/**
 * Copies the index.html to public folder
 * Required in development mode
 */
gulp.task('copy-index-html', function () {
  var replace = require('gulp-replace');

  gulp.src('views/index.html')
    .pipe(gulp.dest('public'));
});

// This task will modify the index.html for the build
gulp.task('modify-index-html', function () {
  var replace = require('gulp-replace');

  gulp.src('public/index.html')
    .pipe(gulp.dest('public'));
});

gulp.task('watch-index-html', function () {
  gulp.watch('views/index.html', ['copy-index-html']);
});
