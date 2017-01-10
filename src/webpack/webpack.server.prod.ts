const webpackMerge = require('webpack-merge');;
import * as path from 'path';
import { commonConfig } from './webpack.common';
import { WebpackHelper } from './helpers';
const helpers = WebpackHelper.getInstance();

const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
/**
 * Webpack Constants
 */

export var serverConfig = webpackMerge(commonConfig, {
  target: 'node',

  entry: {
    'server': './biz.server',
  },

  output: {
    libraryTarget: 'commonjs2',
    path: helpers.root('dist/server'),
    filename: '[name].js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },
  module: {
    rules: [
      { enforce: 'pre', test: /angular\/material/, loader: "imports-loader?window=>global" },
    ],
  },
  plugins: [
    new UglifyJsPlugin({
      // beautify: true, //debug
      // mangle: false, //debug
      // dead_code: false, //debug
      // unused: false, //debug
      // deadCode: false, //debug
      // compress: {
      //   screw_ie8: true,
      //   keep_fnames: true,
      //   drop_debugger: false,
      //   dead_code: false,
      //   unused: false
      // }, // debug
      // comments: true, //debug


      beautify: false, //prod
      mangle: { screw_ie8 : true, keep_fnames: true }, //prod
      compress: { screw_ie8: true }, //prod
      comments: false //prod
    })
  ],
  externals: includeClientPackages([
    // include these client packages so we can transform their source with webpack loaders
    '@angular/material'
  ]),
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});

function includeClientPackages(packages) {
  return function(context, request, cb) {
    if (packages && packages.indexOf(request) !== -1) {
      return cb();
    }
    return helpers.checkNodeImport(context, request, cb);
  };
}
