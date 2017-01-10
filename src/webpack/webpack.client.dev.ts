import * as webpack from 'webpack';
const webpackMerge = require('webpack-merge');;
import { commonConfig } from './webpack.common';
import { WebpackHelper } from './helpers';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = WebpackHelper.getInstance();

export var clientConfig = webpackMerge(commonConfig, {
  target: 'web',

  entry: {
    'root': './biz.client' // TODO: Make this dynamic
  },

  output: {
    path: helpers.root('dist/client'),
    filename: '[name].js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common'),

    new CopyWebpackPlugin([{
      context: 'src',
      from: '**/index.html',
      to: '..'
    }])
  ],

  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
