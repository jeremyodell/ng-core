const webpackMerge = require('webpack-merge');
import * as path from 'path';
import { commonConfig } from './webpack.common';
import { WebpackHelper } from './helpers';
const helpers = WebpackHelper.getInstance();
/**
 * Webpack Constants
 */

export let serverConfig = webpackMerge(commonConfig, {
  target: 'node',

  entry: {
    server: './biz.server',
  },

  output: {
    path: helpers.root('dist/server'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      { enforce: 'pre', test: /angular\/material/, loader: 'imports-loader?window=>global' },
    ],
  },
  externals: includeClientPackages([
    // include these client packages so we can transform their source with webpack loaders
    '@angular/material',
  ]),
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true,
  },
});

function includeClientPackages(packages: any): any {
  return (context, request, cb) => {
    if (packages && packages.indexOf(request) !== -1) {
      return cb();
    }
    return helpers.checkNodeImport(context, request, cb);
  };
}