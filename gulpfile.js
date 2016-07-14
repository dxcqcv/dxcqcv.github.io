const gulp = require('gulp');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const htmlv = require('gulp-html-validator');
const w3cjs = require('gulp-w3cjs');
const cp = require('child_process');

const siteRoot = '_site';
const jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

/**
 * browserSync server
 */
gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
});

/**
 * Build the jekyll site
 gulp.task('jekyll-build', function(done) {
   return cp.spawn( jekyll, ['build'], {stdio: 'inherit'} )
            .on('close', done);
 });
*/
gulp.task('jekyll',() => {
  const jekyll = cp.spawn(jekyll, ['build',
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
  * reload
  */
gulp.task('reload',['jekyll-build'],function(){
  browserSync.reload();
});

/**
 * gulp watch
 */
gulp.task('default', ['webpack'], function(){
  gulp.watch(['index.html','js/*','css/*','_include/*','_posts/*','_layouts/*'],['reload']);
});



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
gulp.task('webpack', ['jekyll-build'], function(){
  return webpack(webpackConfig, function(err,stats){
            if(err) throw new gutil.PluginError('webpack', err);
            gutil.log('webpack', stats.toString({
              colors: true
            }));      
          });
        });