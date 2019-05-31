'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: false })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      //hacfin
      index:'/index/index.html',
      rewrites: [
        { from: /^\/video(\/.*)*$/, to: '/index/video.html' },
        { from: /^\/audio(\/.*)*$/, to: '/index/audio.html' },
        { from: /^\/upload(\/.*)*$/, to: '/index/upload.html' },
        { from: /^\/valaditor(\/.*)*$/, to: '/index/valaditor.html' },
        { from: /^\/editor(\/.*)*$/, to: '/index/editor.html' },
        { from: /^\/m\/index(\/.*)*$/, to: '/phone/index.html' },
        { from: /^\/m\/video(\/.*)*$/, to: '/phone/video.html' },
        { from: /^\/m\/noexsit$/, to: '/phone/noexsit.html' },
      ]
      // rewrites: [
      //   { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      // ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
});

//hacfin
Object.keys(utils.entries()).forEach(function (entry) {
  var entryname = entry.substring(entry.lastIndexOf('/') + 1);
  var entrypre  = entry.substring(0, entry.lastIndexOf('/'));
  var etToZh = {
      'index':'首页',
      'video':'视频'
  }
  var page_title = etToZh[entryname] ? etToZh[entryname] : '';

  devWebpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      title:page_title,
      filename: entry + '.html',
      template: 'src/modules/' + entrypre + '/pages/' + entryname + '/' + entryname + '.pug',
      favicon : 'favicon.ico',
      inject  : true,
      chunks  : [entry],
    })
  )
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
