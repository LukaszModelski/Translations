var gulp = require('gulp');
var autoprefix = require('gulp-autoprefixer'); 
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create(); //reloading while saving file
var useref = require('gulp-useref'); //concatenates file linked in index.html
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');

// ------------------------------------------------- //
// --------- Server and watching for changes --------//
// ------------------------------------------------- //

gulp.task('browserSync', function() {
   browserSync.init({
      server: {
         baseDir: 'src'
      },
   })
});

gulp.task('htmlServer', function() {
   gulp.src(['src/*.+(html|ico)'])
   .pipe(browserSync.reload({
      stream: true
   }));;
});

gulp.task('scssToCssAndMin', function() {
   gulp.src(['src/styles/scss/*.scss'])
   .pipe(plumber())
   .pipe(sass({includePaths: ['./styles/scss']}))
   .pipe(gulp.dest('src/styles/css/'))
   .pipe(browserSync.reload({
      stream: true
   }));
});

gulp.task('jsCombineAndMin', function() {
    gulp.src(['src/scripts/*.js'])
  	.pipe(browserSync.reload({
      stream: true
   }));
});

// --------- wrapped together --------- //

gulp.task('serve', ['browserSync','htmlServer','scssToCssAndMin','jsCombineAndMin'], function() {
	gulp.watch('src/styles/scss/*.scss',['scssToCssAndMin']);
	gulp.watch('src/*.+(html|ico)',['htmlServer']);
	gulp.watch('src/scripts/*.js',['jsCombineAndMin']);
});

// ------------------------------------------------- //
// --------- Creating distribution version --------- //
// ------------------------------------------------- //

gulp.task('imageDist', function() {
   gulp.src('src/images/*')
   .pipe(imagemin())
   .pipe(gulp.dest('dist/images/'));
   gulp.src('src/*.+(ico|png|jpg)') // favicon
   .pipe(gulp.dest('dist/'));
});

gulp.task('fontsDist', function() {
   gulp.src('src/fonts/*')
   .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('vendorDist', function() {
    gulp.src('src/vendor/*')
    .pipe(gulp.dest('dist/vendor/'));
 });
 
gulp.task('useref', function() {
    gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('styles/css/*.css', autoprefixer()))
    .pipe(gulpIf('styles/css/*.css', cssnano()))
    .pipe(gulpIf('scripts/*.js', uglify()))
    .pipe(gulp.dest('dist/'));
});

// --------- wrapped together --------- //

gulp.task('dist', ['useref','vendorDist','imageDist','fontsDist'], function() {

});


