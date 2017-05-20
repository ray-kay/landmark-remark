var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * One time task just before deployment
 * Will install any bower/npm dependencies and then it
 * will run all the scripts - minifying the css/js/bower dependencies
 */
gulp.task('build', function (cb) {
  runSequence('delete-build-files', 'install-dependencies',
    'less-to-css', 'cache-angular-templates', 'minify-assets', 'modify-index-html', cb);
});
