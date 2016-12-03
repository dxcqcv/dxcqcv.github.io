const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const htmlv = require('gulp-html-validator');
const w3cjs = require('gulp-w3cjs');
const child = require('child_process');
const srcFiles = 'src/**';
const siteRoot = '_site';
const jekyllCommand   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};



/**
 * start jekyll with watch
 */
gulp.task('jekyll', () => {
  const jekyll = child.spawn('bundle', ['exec','jekyll','build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
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
gulp.task('webpack', function(){
  return webpack(webpackConfig, function(err,stats){
            if(err) throw new gutil.PluginError('webpack', err);
            gutil.log('webpack', stats.toString({
              colors: true
            }));      
        });
});

/**
 * default task that first webpack then jekyll
 */
gulp.task('default', gulp.series('webpack','jekyll') );