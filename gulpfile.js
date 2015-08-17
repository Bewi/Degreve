var gulp = require('gulp');

var runSequence = require('run-sequence'); // Allow to run task in a sequence
var del = require('del'); // Deletion of files/folders
var size = require('gulp-size'); // used to display size of folders

// JS
var ngAnnotate = require('gulp-ng-annotate'); // Resolve angular injections
var uglify = require('gulp-uglify'); // Minimize js files
var concat = require('gulp-concat'); // Concatenate all js files into one

// CSS
var minifyCss = require('gulp-minify-css'); // Minify css files

// HTML
var filter = require('gulp-filter'); // Filter files
var inject = require('gulp-inject'); // Used to add min libs to the index.html

// Shell
var electron = require('gulp-atom-electron');

// Sources
var src = 'src/';
var appSrc = 'src/app';
var libSrc = 'src/libs';
var cssSrc = 'src/content';
var serverSrc = 'src/server';

// Destinations
var dest = 'dist/';
var libsDest = 'dist/libs';
var appDest = 'dist/app';
var cssDest = 'dist/content';
var serverDest = 'dist/server';


gulp.task('default', function(callback){
  runSequence(
    ['bundle-libs-js', 'bundle-js'],
    'bundle-css',
    'bundle-html',
	'bundle-server',
	'shell',
    callback);
});

gulp.task('build', function(callback) {
	return runSequence(
	['bundle-libs-js', 'bundle-js'],
    'bundle-css',
    'bundle-html',
	'bundle-server',
	callback);
});

gulp.task('bundle-js', function () {
  var concatOpt = { newLine: ';'};
	
  gulp.src([src + '/main.js', src + '/package.json'])
	.pipe(gulp.dest(dest));
  
  return gulp.src([appSrc + '/**/*.module.js', appSrc + '/**/*.js'])
    .pipe(size({showFiles: true}))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.min.js', concatOpt))
    .pipe(gulp.dest(appDest))
    .pipe(size({showFiles: true}));	
});

gulp.task('bundle-libs-js', function () {
  var libs = [
	libSrc + '/underscore/underscore-min.js',
	libSrc + '/angular/angular.min.js',
	libSrc + '/angular-resource/angular-resource.min.js',
	libSrc + '/angular-ui-router/release/angular-ui-router.min.js',
	libSrc + '/angular-ui-notification/dist/angular-ui-notification.min.js',
	libSrc + '/angular-block-ui/dist/angular-block-ui.min.js',
	libSrc + '/angular-hotkeys/build/hotkeys.min.js'
  ];
	
  gulp.src(libs)
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest(libsDest))
	
  gulp.src(libSrc + '/jquery/dist/jquery.min.js').pipe(gulp.dest(libsDest + '/jquery/dist/'));		
});

gulp.task('bundle-css', function () {
    var appCssFilter = filter('app.css');

    gulp.src(cssSrc + '/app.css')
      .pipe(appCssFilter)
      .pipe(size({showFiles: true}))
      .pipe(minifyCss({ processImport: true, keepSpecialComments: 0 }))
      .pipe(gulp.dest(cssDest));
	  
	 gulp.src(cssSrc + '/print.css')
      .pipe(minifyCss({ processImport: true, keepSpecialComments: 0 }))
      .pipe(gulp.dest(cssDest));

    gulp.src(cssSrc + '/font-awesome/fonts/*', {base: cssSrc + '/font-awesome/'})
      .pipe(gulp.dest(cssDest + '/font-awesome'));
});

gulp.task('bundle-html', function () {
  
    // Copy all html files
    gulp.src(appSrc + '/**/*.html')
    .pipe(gulp.dest(appDest));
	
    // Inject minified files to index.html
	gulp.src(src + '/index.html')
	.pipe(gulp.dest(dest))
    .pipe(size({showFiles: true}))
    .pipe(injectWithName(appDest + '/app.min.js'))
    .pipe(injectWithName(libsDest + '/libs.min.js', 'inject-libs'))
    .pipe(gulp.dest(dest));

  function injectWithName(path, name) {
    var opt = {
      ignorePath: dest,
      read: false,
      addRootSlash: false,
      name: name
    };

    return inject(gulp.src(path), opt)
  }
});

gulp.task('bundle-server', function() {
	gulp.src(serverSrc + '/**/*')
		.pipe(gulp.dest(serverDest))
});

gulp.task('clean', function(cb) {
  del(['dist']);
});

gulp.task('shell', function () {
    return gulp.src('dist/**')
        .pipe(electron({ version: '0.27.2', platform: 'win32' }))
        .pipe(electron.zfsdest('shell.zip'));
});