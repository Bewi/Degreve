var gulp = require('gulp');

var runSequence = require('run-sequence'); // Allow to run task in a sequence
var merge = require('merge-stream'); // Allow to merge multiple stream in one task
var del = require('del'); // Deletion of files/folders
var size = require('gulp-size'); // used to display size of folders
var install = require('gulp-install'); // used to install only prod packages of server
var rename = require('gulp-rename');

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
var electron = require('gulp-electron');

// Sources
var src = 'src/';
var appSrc = 'src/app';
var libSrc = 'src/libs';
var contentSrc = 'src/content';
var serverSrc = 'src/server';

// Destinations
var dest = 'dist/';
var libsDest = 'dist/libs';
var appDest = 'dist/app';
var contentDest = 'dist/content';
var serverDest = 'dist/server';
var releaseDest = './release';

gulp.task('build', function(callback){
  runSequence(
    'cleanShell',
    // ['bundle-libs-js', 'bundle-js'],
    // 'bundle-css',
    // 'bundle-html',
  	// 'bundle-server',
    'default',
  	'shell',
    'clean',
    callback);
});

gulp.task('default', function(callback) {
	return runSequence(
	['bundle-libs-js', 'bundle-js'],
    'bundle-css',
    'bundle-html',
	'bundle-server',
	callback);
});

gulp.task('bundle-js', function () {
  var concatOpt = { newLine: ';'};

  var main = gulp.src([src + 'squirrel.js', src + '/main.js', src + '/package.json'])
	.pipe(gulp.dest(dest));

  var modules =  gulp.src([appSrc + '/**/*.module.js', appSrc + '/**/*.js'])
    .pipe(size({showFiles: true}))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.min.js', concatOpt))
    .pipe(gulp.dest(appDest))
    .pipe(size({showFiles: true}));

  return merge(main, modules);
});

gulp.task('bundle-libs-js', function () {
  var libs = [
  	libSrc + '/ramda/dist/ramda.min.js',
    libSrc + '/bootstrap/dist/js/bootstrap.min.js',
  	libSrc + '/angular/angular.min.js',
    libSrc + '/angular-resource/angular-resource.min.js',
    libSrc + '/angular-ui-router/release/angular-ui-router.min.js',
    libSrc + '/angular-ui-notification/dist/angular-ui-notification.min.js',
    libSrc + '/angular-block-ui/dist/angular-block-ui.min.js',
    libSrc + '/angular-hotkeys/build/hotkeys.min.js',
    libSrc + '/angular-bootstrap/ui-bootstrap-tpls.min.js'
  ];

  var libsStream = gulp.src(libs)
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest(libsDest))
    .pipe(size({showFiles: true}));

  var jquery = gulp.src(libSrc + '/jquery/dist/jquery.min.js').pipe(gulp.dest(libsDest + '/jquery/dist/'));

  return merge(libsStream, jquery);
});

gulp.task('bundle-css', function () {
    var appCssFilter = filter('app.css');

    var app = gulp.src(contentSrc + '/app.css')
      .pipe(appCssFilter)
      .pipe(size({showFiles: true}))
      .pipe(minifyCss({ processImport: true, keepSpecialComments: 0 }))
      .pipe(gulp.dest(contentDest));

    var print = gulp.src(contentSrc + '/print.css')
      .pipe(minifyCss({ processImport: true, keepSpecialComments: 0 }))
      .pipe(gulp.dest(contentDest));

    var fonts = gulp.src(contentSrc + '/font-awesome/fonts/*', {base: contentSrc + '/font-awesome/'})
      .pipe(gulp.dest(contentDest + '/font-awesome'));
      
    var images = gulp.src(contentSrc + '/*.png')
      .pipe(gulp.dest(contentDest));

    return merge(app, print, fonts, images);
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

    return inject(gulp.src(path), opt);
  }
});

gulp.task('bundle-server', function() {
	var server = gulp.src(['!' + serverSrc + '/node_modules/', '!' + serverSrc + '/node_modules/**',
            '!' + serverSrc + '/spec/', '!' + serverSrc + '/spec/**', '!' + serverSrc + '/models/hero.tokens.js', '!' + serverSrc + '/models/hero.tokens.prod.js',
          serverSrc + '/**/*'])
		.pipe(gulp.dest(serverDest));

  var pack = gulp.src(serverSrc + '/package.json')
    .pipe(gulp.dest(serverDest))
    .pipe(install({production: true}));
    
  var tokens = gulp.src(serverSrc + '/models/hero.tokens.prod.js')
    .pipe(rename('hero.tokens.js'))
    .pipe(gulp.dest(serverDest + '/models'));

    return merge(server, pack, tokens);
});

gulp.task('clean', function(cb) {
    return del.sync('dist');
});

gulp.task('cleanShell', function() {
    return del.sync(releaseDest);
});

gulp.task('shell', function() {
    var packageJson = require('./src/package.json');
    
    return gulp.src("")
    .pipe(electron({
        src: './dist',
        packageJson: packageJson,
        release: releaseDest,
        cache: './cache',
        version: 'v0.36.0',
        packaging: false,
        platforms: ['win32-ia32'],
        platformResources: {
            win: {  
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "icon": 'icon.ico'
            }
        }
    }))
    .pipe(gulp.dest(""));
});
