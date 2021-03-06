'use strict';

// Set Env
// process.env.NODE_ENV = 'development';
process.env.NODE_ENV = 'production';

// Check ENV
global.devBuild = process.env.NODE_ENV !== 'production';


// common
const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const runSequence =  require('run-sequence');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const debug = require('gulp-debug');
const newer = require('gulp-newer');


// pug
// const pug = require('gulp-pug');
const jade = require('gulp-jade');
const jadeGlobbing = require('gulp-jade-globbing');

const cached = require('gulp-cached');
const progeny = require('gulp-progeny');
// const pugInheritance = require('gulp-pug-inheritance');
const filter = require('gulp-filter');
const prettify = require('gulp-prettify');

// less
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cleancss = require('gulp-cleancss');
const rename = require('gulp-rename');

// js
const browserify = require('browserify');
const glob = require('glob');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// img
const imagemin = require('gulp-imagemin');

// png-sprite
const spritesmith = require('gulp.spritesmith');

// Path
const path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/',
    pngSprites: 'src/img/',
    pngSpritesCss: 'src/less/common/',
    deploy: 'build/**/*'
  },
  src: {
    // html: ['src/html/**/*.pug', '!src/html/partials/abstracts/bemto/**/*.*'],
    // html: ['src/html/**/*.pug', '!src/html/**/_*.pug', '!src/html/partials/abstracts/bemto/**/*.*'],
    html: 'src/html/pages/*.jade',
    htmlDir: './src/html/pages/',
    js: 'src/js/**/*.js',
    less: './src/less/*.less',
    img: ['src/img/**/*.*', '!src/img/png-sprite/*.*'],
    fonts: 'src/fonts/**/*.*',
    pngSprites: 'src/img/png-sprite/*.png',
    browserify: 'src/js/*.js'
  },
  watch: {
    jade: ['src/html/**/*.jade', 'src/blocks/**/*.jade'],
    js: 'src/js/**/*.js',
    less: ['src/less/**/*.less', 'src/blocks/**/*.less'],
    img: 'src/img/*.*',
    fonts: 'src/fonts/**/*.*',
    pngSprites: 'src/img/png-sprite/*.png'
  },
  clean: './build'
};

// Compilation jade
var blocks = 'src\\blocks\\**\\*.jade';

gulp.task('jade', function() {
  return gulp.src(path.src.html)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(jadeGlobbing({ 
      // placeholder: {
        // 'blocks': blocks,
      // }
    }))
    // { errorHandler: onError }
    // .pipe(gulpif(devBuild, changed(path.build.html, {extension: '.html'})))
    // .pipe(gulpif(global.isWatching, cached('pug')))
    // .pipe(pugInheritance({basedir: path.src.htmlDir}))
    // .pipe(filter(function (file) {
    //   return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    // }))
    .pipe(jade())
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(gulp.dest(path.build.html))
})

// Compilation less
gulp.task('less', function () {
  return gulp.src(path.src.less)
    // .pipe(debug({title: 'src'})) 
    .pipe(plumber({ errorHandler: onError }))
    // .pipe(debug({title: 'plumber'}))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({ browsers: ['last 5 version'] }),
      mqpacker({ sort: true }),
    ]))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.build.css))
    .pipe(cleancss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(path.build.css))
});

// Compilation js v2 
// (If jquery is used from 3rd party, and you need to exclude it from script.min.js, you should manually put all required .js files into path.src.js directory)
gulp.task('js', function() {
  return gulp.src(path.src.js)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.build.js))
});

// Optimization images
gulp.task('img', function () {
  return gulp.src(path.src.img)
    .pipe(newer(path.build.img))
    .pipe(gulpif(devBuild, changed(path.build.img)))
    .pipe(gulpif(!devBuild, imagemin()))
    .pipe(gulp.dest(path.build.img))
    // .pipe(reload({stream: true}));
});

// Creation png-sprites
gulp.task('png-sprites', function () {
  var spriteData = gulp.src(path.src.pngSprites)
    .pipe(spritesmith({
      imgName: 'png-sprite.png',
      imgPath: '../img/png-sprite.png',
      padding: 1,
      cssFormat: 'less',
      algorithm: 'binary-tree',
      cssName: '_png-sprite.less'
      // cssVarMap: function(sprite) {
      //   sprite.name = 's-' + sprite.name
      // }
    }));

  spriteData.img
    .pipe(gulp.dest(path.build.pngSprites));

  return spriteData.css
    .pipe(gulp.dest(path.build.pngSpritesCss));
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src(path.src.fonts)
    .pipe(newer(path.build.fonts))
    .pipe(gulp.dest(path.build.fonts))
});

// Clean
gulp.task('clean', function () {
  return del(path.clean);
});

// Overall build
gulp.task('build', gulp.series('clean', gulp.parallel('png-sprites', 'jade', 'fonts', 'js' , gulp.parallel('img', 'less'))));


// Overall watch
gulp.task('watch', function(){
  gulp.watch(path.watch.pngSprites, gulp.series('png-sprites'));
  gulp.watch(path.watch.jade, gulp.series('jade'));
  gulp.watch(path.watch.less, gulp.series('less'));
  gulp.watch(path.watch.img, gulp.series('img'));
  gulp.watch(path.watch.js, gulp.series('js'));
  gulp.watch(path.watch.fonts, gulp.series('fonts'));
});

// Server config
var config = {
  server: {
    baseDir: "./build"
  },
//  tunnel: true,
  host: 'localhost',
  port: 9000
};

// Browser sync
gulp.task('serve', function() {
  browserSync.init(config);

  // browserSync.reload;
  browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});



// Default task
gulp.task('default', 
  // gulp.series('build', 'serve', 'watch')
  gulp.series('build', gulp.parallel('watch', 'serve'))
);


var onError = function(err) {
  notify.onError({
    title: "Error in " + err.plugin,
  })(err);
  this.emit('end');
}