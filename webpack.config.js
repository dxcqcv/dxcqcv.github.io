'use strict';

const webpack = require('webpack');

// for browserSync
//const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
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
  let fileList = [];

  let entryList = glob.sync(PATHS.app+'/**/*.'+type).reduce(function(o,v,i) {
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
  })
});

module.exports = {
  entry: getEntryList('ts'),
  output: {
    path: PATHS.bin,
//    publicPath: '{{site.baseurl}}/',
    publicPath: './',
    filename: 'js/[name]-[hash:8].js'
  },
      // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js","styl"]
    },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jshint'
      }
    ],
    loaders: [
      /********* pug to js */
      {
        test:/\.pug$/,
        exclude: /node_modules/,
        loader: 'pug-html-loader',
        query: {
          pretty: true
        }
      },
      /********* ts to js */
      {
        test:/\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      /********* stylus to css*/
      {
        test: /\.styl$/,
        exclude: ['/node_modules/','/src/css/includes/'],
        loader: ExtractTextPlugin.extract('style',['css','stylus'])
      },
      /********* url loader*/
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=8192&name=[name]-[hash:8].[ext]'
      }
    ]
  },
  watch: true,
  plugins: [
    /** clean folders */
    new CleanWebpackPlugin(['css','js'],{
      root: __dirname,
      verbose: true,
      dry: false 
    }),
    /** commonsPlugin */
    new webpack.optimize.CommonsChunkPlugin("commons", "js/commons-[hash:8].js"),
    /** extract css */
    new ExtractTextPlugin('css/[name]-[hash:8].css'),
    /*
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['_site'] }
    },{reload:false})
    */
  ].concat(entryHtmlPlugins),
  jshint: {
    esversion: 6
  }
};