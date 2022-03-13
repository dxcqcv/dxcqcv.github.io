---
layout: post
title: webpack for jekyll
tags:
- webpack
- jekyll
excerpt: build personal blog with webpack
---

## why
- because you can build github page site with webpack, jade and stylus, so nice.

## before start

1. you should know [webpack](https://webpack.github.io/)
2. you should know [jade](http://jade-lang.com/)
3. you should know [stylus](http://stylus-lang.com/)

## workflow

#### webpack for jade (pug is new name for jade)

1. install pug-loader and html-webpack-plugin 

{% highlight ruby linenos %}
  npm i pug-loader html-webpack-plugin -S
{% endhighlight %}

2. loade multiple `pug` then output html for jekyll

{% highlight javascript linenos %}
  // for creation of HTML
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  ...
  /**
  * loop multiple files
  */
  let entryHtmlPlugins = Object.keys(getEntryList('pug')).map(function(entryName){
    let v = getEntryList('pug')[entryName]; // get full path
    let filenamePath = v.split(/src\/([^.]*)/)[1] +'.html';
    let templatePath = v.split(/(src\/.*)/)[1];
    // filter chunks config
    let chunkList = [];
    switch(entryName){
      case 'default':
        chunkList.push('commons','index');
    }
    return new HtmlWebpackPlugin({
      filename: filenamePath,
      chunks: chunkList,
      template: templatePath
    })
  });
  ...
  ...
  /********* pug to js */
  {
    test:/\.pug$/,
    exclude: ['/node_modules/','src/layouts/post.pug'],
    loader: 'pug-html-loader',
    query: {
      pretty: true // must be pretty html for jekyll
    }
  },
  ...
  ... 
    plugins: [
      ...
  ].concat(entryHtmlPlugins)
  ...
{% endhighlight %}

#### webpack for stylus

1. install stylus-loader and extract-text-webpack-plugin

{% highlight sh linenos %}
  npm i stylus-loader extract-text-webpack-plugin -S
{% endhighlight %}
    
2. load multiple stylus then extract css for html

{% highlight javascript linenos %}
  // for extract css
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  ...
  // path
  const path = require('path');
  const PATHS = {
    app: path.join(__dirname, 'src'),
    bin: path.join(__dirname, '')
  };
  ...
  ...
  // for get multiple entry list
  function getEntryList (type) {
    let glob = require('glob');
    let fileList = [];
    let entryList = glob.sync(PATHS.app+'/**/*.'+type).reduce(function(o,v,i) {
      let regex = /([^\/]+)(?=\.\w+$)/;
      let index = v.match(regex)[0];
      o[index] = v;
      return o;
    },{});
    return entryList;
  } 
  ...
  ...
  module.exports = {
    entry: getEntryList('ts'),
    output: {
      path: PATHS.bin,
      publicPath: debug ? './':'{{site.baseurl}}/',
      filename: debug ? 'js/[name].js' : 'js/[name]-[hash:8].js'
    },
  ...
  plugins: [
    ...
    /** extract css */
    new ExtractTextPlugin('css/[name].css'),
    ...
  ]
{% endhighlight %}

#### webpack for font-awesome

1. install url-loader file-loader

{% highlight ruby linenos %}
  npm i font-awesome url-loader file-loader -S
{% endhighlight %}

2. config woff, woff2, ttf, eot, svg for font-awesome

{% highlight javascript linenos %}
  ...
  loaders: [
      {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader:  "url?limit=10000&mimetype=application/font-woff&name=./fonts/[name].[ext]"
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader:  "url?limit=10000&mimetype=application/font-woff&name=./fonts/[name].[ext]"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader:  "url?limit=10000&mimetype=application/octet-stream&name=./fonts/[name].[ext]"
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader:  "file?&name=./fonts/[name].[ext]":"file?&name=./fonts/[name]-[hash:8].[ext]"
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader:  "url?limit=10000&mimetype=image/svg+xml&name=./fonts/[name].[ext]"
    },
  ...
{% endhighlight %}

#### local debug jekyll

1. install browser-sync, browser-sync-webpack-plugin, gulp 

{% highlight javascript linenos %}
  npm i browser-sync browser-sync-webpack-plugin gulp -S
{% endhighlight %}

2. build webpack then start jekyll in child_process

{% highlight javascript linenos %}
  const webpackConfig = require('./webpack.config.js');
  const child = require('child_process');
  const jekyllCommand   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
  var messages = {
      jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
  };

  /**
  * start jekyll with watch
  */
  gulp.task('jekyll', () => {
    const jekyll = child.spawn('jekyll', ['build',
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
  gulp.task('default', [ 'webpack','jekyll' ]);
{% endhighlight %}

#### bug
for now, there is a bug with using pug to html, and not be fixed. pug [issue](https://github.com/pugjs/pug/issues/2443)

I use pug to write jekyll make github page, so when I used yml front matter in pug, it always compiled a blank line at first line, so code like

{% highlight javascript linenos %}
  |---
  |layout: default
  |title: Shang Wen Long's blog
  |---
  .hello index contents
{% endhighlight %}

be compiled to 

{% highlight javascript linenos %}
  /******** Here is a blank line **********/
  ---
  layout: default
  title: Shang Wen Long's blog
  ---
  <div class="hello">index contents</div>
{% endhighlight %}

Through my test, in pretty mode because jekyll needs yml front matter format, there is blank line at first line without doctype, but with doctype everything is OK
