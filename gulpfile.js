const gulp = require('gulp');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const gTrim = require('gulp-trim');
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
 * browserSync 
 */
gulp.task('browser-sync', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    host: 'localhost',
    port: 3000,
    server: {
      baseDir:[siteRoot]
    }
  })
});

/**
 * remove fist blank line
 */
gulp.task('trim', (done) => {
  gulp.src('index.html')
      .pipe(gTrim())
      .pipe(gulp.dest('.'));
  gulp.src(['_layouts/page.html','_layouts/post.html'])
      .pipe(gTrim())
      .pipe(gulp.dest('_layouts'));
  done();
});

/**
 * start jekyll with watch
 */
gulp.task('jekyll', (done) => {
  const jekyll = child.spawn('bundle', ['exec','jekyll','build',
    // '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    done(); // to signal async completion
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
gulp.task('webpack', function(done){
  webpack(webpackConfig, function(err,stats){
            if(err) throw new gutil.PluginError('webpack', err);
            gutil.log('webpack', stats.toString({
              colors: true
            }));      
        done(); // call done when cb done
        });
});

/**
 * watch src folder change then run webpack
 * watch dist folder change then reload browser
 */
var srcWatcher = gulp.watch('src/**/*',gulp.series('webpack','trim','jekyll',function() {
  browserSync.reload();
}));

/**
 * default task that first webpack then jekyll
 */
gulp.task('default', gulp.series('webpack','trim','jekyll','browser-sync') );