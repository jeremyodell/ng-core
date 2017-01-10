// var webpackMerge = require('webpack-merge');
// var clientConfig = require('./webpack.client.dev.js');
// var serverConfig = require('./webpack.server.dev.js');
import { clientConfig } from './webpack.client.dev';
import { serverConfig } from './webpack.server.dev';
export default [
  // Client
  clientConfig,

  // Server
  serverConfig
];
