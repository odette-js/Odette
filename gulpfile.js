// var gulp = require('gulp');
// var path = require('path');
// var runSequence = require('run-sequence');
// var settings = require('./settings');
// var watch = require('gulp-watch');
// var plumber = require('gulp-plumber');
// var _ = require('lodash');
// var uglify = require('gulp-uglify');
// var browserify = require('browserify');
// var transform = require('vinyl-transform');
// var serverPath = path.join(__dirname, 'index.js');
// var child_process = require('child_process');
// var paths = {
//     publicized: './src/static/**/*',
//     publicizedOutput: './dist',
// };
// gulp.task('copy-static', function () {
//     gulp.src(paths.publicized) //
//         .pipe(require(path.join(process.cwd(), 'replace-root-url'))('./src/static', './dist/')) //
//         .pipe(gulp.dest(paths.publicizedOutput));
// });
// gulp.task('altserver', function () {
//     return require(serverPath)(settings.http.port - 80);
// });
// gulp.task('serve', function () {
//     return require(serverPath)(settings.http.port);
// });
// gulp.task('watch', function () {
//     var id;
//     watch('./src/**/*', {
//         ignoreInitial: true,
//         events: ['change']
//     }, function () {
//         clearTimeout(id);
//         id = setTimeout(function () {
//             gulp.start('build');
//         }, 250);
//     });
// });
// gulp.task('browserify', function () {
//     var child = child_process.exec('make build_all');
//     child.stdout.on('data', function (data) {
//         console.log(data);
//     });
//     child.stderr.on('data', (data) => {
//         console.log(`stderr: ${data}`);
//     });
//     child.on('close', (code) => {
//         console.log(`child process exited with code ${code}`);
//     });
// });
// gulp.task('build', function (cb) {
//     runSequence('copy-static', 'browserify', cb);
// });
// gulp.task('dev', function (cb) {
//     runSequence('build', ['serve', 'altserver'], 'watch', cb);
// });