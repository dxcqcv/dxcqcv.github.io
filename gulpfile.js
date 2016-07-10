var gulp = require('gulp');
let gutil = require('gulp-util');
var pug = require('gulp-pug');
let webpack = require('webpack');
let webpackConfig = require('./webpack.config.js');
let puglint = require('gulp-pug-lint');
let htmlv = require('gulp-html-validator');
let w3cjs = require('gulp-w3cjs');
let htmlExculds = '!./src/_layouts/default.pug';

/*************** watch ************************/
gulp.task('watch', function(){
  gulp.watch(['./src/**/*.pug',htmlExculds ],['html']); 
  gulp.watch(['./src/**/*.styl','./src/**/*.ts','./src/_layouts/default.pug'],['webpack']); 
});

/*************** pug to html ************************/
gulp.task('hc', function(){
  return gulp.src('_site/index.html')
             .pipe(htmlv())
             .pipe(gulp.dest('./test/'));
});
gulp.task('hc2', function(){
  return gulp.src('_site/index.html')
             .pipe(w3cjs())
             .pipe(w3cjs.reporter())
             .pipe(gulp.dest('./test/'));
});
/*************** pug to html ************************/
gulp.task('html', function(){
  return gulp.src(['./src/*.pug','./src/**/*.pug',htmlExculds ])
             .pipe(puglint())
             .pipe(pug({pretty:true}))
             .pipe(gulp.dest('./'));
});

/*************** webpack ************************/
gulp.task('webpack', function(callback){
  webpack(webpackConfig, function(err,stats){
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('webpack', stats.toString({
      colors: true
    }));      
    callback();
  });
});