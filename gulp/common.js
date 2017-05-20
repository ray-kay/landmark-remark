var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var installer = require("gulp-install");
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
//var gulpNgConfig = require('gulp-ng-config');
var ngAnnotate = require('gulp-ng-annotate');
var lazypipe = require('lazypipe');
//var stripDebug = require('gulp-strip-debug');
//var RevAll = require('gulp-rev-all');

//var isProductionEnv = false;//process.env.NODE_ENV === 'production';

// Create a common pipe for minifying the angular JS files
var minifyJS = lazypipe()
  /*.pipe(function () {
    return gulpif(isProductionEnv, stripDebug());
  })*/
  .pipe(ngAnnotate)
  .pipe(uglify);

/**
 * Picks up all the html templates and creates a new angular
 * module called "templates.js".
 * This module is a cached version of all the html pages.
 * Helps boost performance
 */
gulp.task('cache-angular-templates', function () {
  return gulp.src('templates/**/*.html')
    .pipe(templateCache({
      module: 'angular-templates',
      standalone: true
    }))
    .pipe(gulp.dest('public'));
});

/**
 * Compile less to css
 */
gulp.task('less-to-css', function () {
  return gulp.src(['public/assets/less/main.less'])
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(concat('compiled.min.css'))
    .pipe(gulp.dest('public'));
});

/**
 * Minifies all the less and css files specified in the index.html
 */
gulp.task('minify-css', function () {
  return gulp.src('views/index.html')
    .pipe(useref({
      transformPath: function (filePath) {
        return filePath.replace('views', 'public');
      }
    }))
    .pipe(gulpif('*.css', cleanCSS()))
    .pipe(gulpif('*.js', minifyJS()))
    .pipe(gulp.dest('public'));
});

/**
 * Minifies all the js and css files specified in the index.html
 */
gulp.task('minify-assets', function () {
  /*var revAll = new RevAll({
    dontRenameFile: [/^\/favicon.ico$/g, '.html']
  });*/

  return gulp.src('views/index.html')
    .pipe(useref({
      transformPath: function (filePath) {
        return filePath.replace('views', 'public');
      }
    }))
    .pipe(gulpif('*.css', cleanCSS()))
    .pipe(gulpif('*.js', minifyJS()))
    //.pipe(gulpif(!isDevelopmentEnv, revAll.revision()))
    .pipe(gulp.dest('public'));
});

/**
 * Minifies all the js dependencies specified in the index.html
 */
gulp.task('minify-js', function () {

  return gulp.src('views/index.html')
    .pipe(useref({
      transformPath: function (filePath) {
        return filePath.replace('views', 'public');
      }
    }))
    .pipe(gulpif('*.js', minifyJS()))
    .pipe(gulp.dest('public'));
});

/**
 * Automatically run bower install and npm install
 */
gulp.task('install-dependencies', function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(installer());
});
