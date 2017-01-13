import * as webpack from 'webpack';
import { WebpackHelper } from './helpers';
import { commonConfig } from './webpack.common';

const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = WebpackHelper.getInstance();

export let clientConfig = webpackMerge(commonConfig, {
  target: 'web',

  entry: {
    root: './biz.client', // TODO: Make this dynamic
  },

  output: {
    path: helpers.root('dist/client'),
    filename: '[name].js',
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common'),

    new CopyWebpackPlugin([{
      context: 'src',
      from: '**/index.html',
      to: '..',
    }]),
  ],

  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
});
