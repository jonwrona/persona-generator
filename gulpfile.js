// gulpfile.js
// author: Jonathan Wrona
// This gulpfile will automatically compile the sass into css and es6 into
//   javascript (with babel) and also can run a server with livereload for
//   development.
// COMMANDS
//   gulp         |   will start a livereload server and watch for changes to
//                |     compile and push to the browser
//   gulp build   |   will compile all of the files into the docs folder
//                |     (docs because github pages can be hosted from the docs
//                |     directory of the master branch)


const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const livereload = require('gulp-livereload');
const watch = require('gulp-watch');
const http = require('http');
const st = require('st');


// GENERATORS
// ==========

// SASS Compile
// ------------

gulp.task('styles', ['clean-styles'], function() {
  return gulp.src('./src/sass/styles.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./docs/css'))
    .pipe(livereload());;
});

gulp.task('clean-styles', function() {
  return gulp.src('./docs/css/*.css', {
      read: false
    })
    .pipe(clean());
});

// ES6 Compile
// -----------

gulp.task('scripts', ['clean-scripts'], function() {
  return gulp.src("./src/js/**/*.js")
    .pipe(babel())
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("./docs/js"))
    .pipe(livereload());
});

gulp.task('clean-scripts', function() {
  return gulp.src('./docs/js/*.js', {
      read: false
    })
    .pipe(clean());
});

// FILE COPYING
// ============

// Copy HTML
// ---------

gulp.task('html', ['clean-html'], function() {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./docs'))
    .pipe(livereload());
});

gulp.task('clean-html', function() {
  return gulp.src('./docs/index.html', {
      read: false
    })
    .pipe(clean());
});

// Copy Assets
// -----------

gulp.task('assets', ['clean-assets'], function() {
  gulp.src('./src/assets/**/*.*')
    .pipe(gulp.dest('./docs/assets'))
    .pipe(livereload());
});

gulp.task('clean-assets', function() {
  return gulp.src('./docs/assets/**/*.*', {
      read: false
    })
    .pipe(clean());
});

// SERVER
// ======

gulp.task('watch', ['server'], function() {
  livereload.listen({
    basePath: 'docs'
  });
  watch('./src/sass/styles.scss', () => gulp.run(['styles']));
  watch("./src/js/**/*.js", () => gulp.run(['scripts']));
  watch('./src/index.html', () => gulp.run(['html']));
  watch('./src/assets/**/*.*', () => gulp.run(['assets']));
});

gulp.task('server', function(done) {
  let port = 8000;
  http.createServer(
    st({
      path: __dirname + '/docs',
      index: 'index.html',
      cache: false
    })
  ).listen(port, done);
  console.log(`Running server on port ${port}`)
});

// DEFAULT TASK
// ============

gulp.task('default', function() {
  gulp.start('styles', 'scripts', 'html', 'assets', 'watch');
});

gulp.task('build', function() {
  gulp.start('styles', 'scripts', 'html', 'assets');
});
