'use strict';

const webpack = require('webpack');

const debug = process.env.NODE_ENV !== 'production';


/**
 * postcss
 */
const cssnext = require('postcss-cssnext'); 
const opacity = require('postcss-opacity'); 
const vmin = require('postcss-vmin'); 
const will_change= require('postcss-will-change'); 
const alias = require('postcss-alias');
/**
 * refence
 */
//const siteRoot = '_site';
// for clean folders before building
const CleanWebpackPlugin = require('clean-webpack-plugin');
// for creation of HTML
const HtmlWebpackPlugin = require('html-webpack-plugin');
// for extract css
const ExtractTextPlugin = require('extract-text-webpack-plugin');


// path
const path = require('path');
const PATHS = {
  app: path.join(__dirname, 'src'),
  bin: path.join(__dirname, '')
};

// for get multiple entry list
function getEntryList (type) {
  let glob = require('glob');
  //let fileList = [];

  let entryList = glob.sync(PATHS.app+'/**/*.'+type).reduce(function(o,v) {
    let regex = /([^\/]+)(?=\.\w+$)/;
    let index = v.match(regex)[0];
    o[index] = v;
    return o;
  },{});
  return entryList;
} 

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
  });
});

module.exports = {
  entry: getEntryList('ts'),
  output: {
    path: PATHS.bin,
     publicPath: '{{site.baseurl}}',
   // use / to show awesome css icon
    //publicPath: './',
    filename: debug ? 'js/[name].js' : 'js/[name]-[hash:8].js'
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    'alias': {
      'Long': 'long',
      'ByteBuffer': 'bytebuffer'
    },
    enforceModuleExtension: true,
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [ '.webpack.js', '.web.js', '.ts', '.tsx', 'styl']
  },
  module: {
    rules: [
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use:[{ loader: 'url-loader',
          options: {
            limit:'10000',
            mimetype:'application/font-woff',
            //name:'./fonts/[name].[ext]?[hash:8]'
            name:'./fonts/[name].[ext]?[hash:8]'
          }
        } ]
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use:[{ 
          loader: 'url-loader',
          options: {
            limit:'10000',
            mimetype:'application/font-woff',
            //name:'./fonts/[name].[ext]?[hash:8]'
            name:'./fonts/[name].[ext]?[hash:8]'
          }
        } ]
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use:[{ 
          loader: 'url-loader',
          options: {
            limit:'10000',
            mimetype:'application/octet-stream',
            //name:'./fonts/[name].[ext]?[hash:8]'
            name:'./fonts/[name].[ext]?[hash:8]'
          }
        } ]
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use:[{ 
          loader: 'file-loader',
          options: {
            //name:'./fonts/[name].[ext]?[hash:8]'
            name:'./fonts/[name].[ext]?[hash:8]'
          }
        } ]
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use:[{ 
          loader: 'url-loader',
          options: {
            limit:'10000',
            mimetype:'image/svg+xml',
            //name:'./fonts/[name].[ext]?[hash:8]'
            name:'./fonts/[name].[ext]?[hash:8]'
          }
        } ]
      },
      /********* css to js */
      // {
      //   test: /\.css$/,
      //   exclude: ['/node_modules/'],
      //   loader: ExtractTextPlugin.extract('style',['css','postcss'],{publicPath:'.'})
      // },
       {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use:[{ 
          loader: 'file-loader',
          options: {
            //name:'./fonts/[name].[ext]?[hash:8]'
            name:'./fonts/[name].[ext]?[hash:8]'
          }
        } ]
      },
      /********* ts to js */
      {
        test:/\.ts$/,
        exclude: /node_modules/,
        use: [{loader: 'ts-loader' }] 
      },
      /********* stylus to css*/
      {
        test: /\.(styl|css)$/,
        exclude: ['/node_modules/','/src/css/includes/'],
        use:ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:['css-loader','postcss-loader','stylus-loader']
        })  
      },
      /********* pug to js */
      {
        test:/\.pug$/,
        exclude: ['/node_modules/','src/layouts/post.pug'],
        use: {
          loader:'pug-loader',
          options: {
            pretty: true
          }
        } ,
      },
      /********* url loader*/
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        use:[{ 
          loader: 'url-loader',
          options: {
            limit: '8192',
            name:'[name].[ext]?[hash:8]'
          }
        } ]
      }
    ]
  },
  // loader-utils/issues/56
  plugins: debug ? [
    /** clean folders */
    new CleanWebpackPlugin(['css/','js/','_site/js/','_site/css/'],{
      root: __dirname,
      verbose: true,
      dry: false 
    }),
     new webpack.LoaderOptionsPlugin({
       debug: true,
       options: {
         resolve:{
           extensions: ['.ts', '.tsx', '.js']
         },
        postcss: [
          alias,
          will_change,
          vmin,
          cssnext({browsers:'last 2 versions,> 1%,ie >= 8'}),
          opacity
        ], 
       }
     }),
    /** commonsPlugin */
    new webpack.optimize.CommonsChunkPlugin({name:'commons',filename:'js/commons.js'} ),
    /** extract css */
    new ExtractTextPlugin({
      filename:  'css/[name].css'
    }),
    new ExtractTextPlugin({
      filename:'_site/css/[name].css'
    }),
  ].concat(entryHtmlPlugins ):[
    /** clean folders */
    new CleanWebpackPlugin(['css/','js/','_site/js/','_site/css/'],{
      root: __dirname,
      verbose: true,
      dry: false 
    }),
    /** commonsPlugin */
    new webpack.optimize.CommonsChunkPlugin({name:'commons', filename:'js/commons-[hash:8].js'}),
    /** extract css */
    new ExtractTextPlugin({
      filename:'css/[name]-[hash:8].css'
    }),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ].concat(entryHtmlPlugins )};
