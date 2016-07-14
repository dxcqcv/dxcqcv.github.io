const gulp = require('gulp');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const htmlv = require('gulp-html-validator');
const w3cjs = require('gulp-w3cjs');
const cp = require('child_process');

const siteRoot = '_site';
const jekyllCommand   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

/**
 * browserSync server
 */
gulp.task('serve', () => {
  browserSync.init({
  /*
    files: [siteRoot + '/**'],
    port: 4000,
    */
    server: {
      baseDir: siteRoot
    }
  });
  gulp.watch(['src/**/*'],['webpack']);
});


gulp.task('jekyll',() => {
  const jekyll = cp.spawn(jekyllCommand, ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);
  
  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: '+message));
  }
  
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});



/**
 * gulp watch
 */
gulp.task('default', ['webpack', 'jekyll', 'serve']);



/*************** validator html ************************/
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


/*************** webpack ************************/
gulp.task('webpack', function(){
  return webpack(webpackConfig, function(err,stats){
            if(err) throw new gutil.PluginError('webpack', err);
            gutil.log('webpack', stats.toString({
              colors: true
            }));      
          });
        });