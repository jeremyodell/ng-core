// let webpackMerge = require('webpack-merge');
// let clientConfig = require('./webpack.client.dev.js');
// let serverConfig = require('./webpack.server.dev.js');
import { clientConfig } from './webpack.client.dev';
import { serverConfig } from './webpack.server.dev';
export default [
  // Client
  clientConfig,

  // Server
  serverConfig,
];
