'use strict'

const path              = require('path');//获取路径的方法
const utils             = require('./utils');//公用方法
const webpack           = require('webpack');//webpack
const config            = require('../config');//配置对象
const merge             = require('webpack-merge');//合并工具
const baseWebpackConfig = require('./webpack.base.conf');//获取基本配置
const CopyWebpackPlugin = require('copy-webpack-plugin');//复制工具
const HtmlWebpackPlugin = require('html-webpack-plugin');//HTML工具
const ExtractTextPlugin = require('extract-text-webpack-plugin');//CSS抽离工具
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');//CSS去重工具
const UglifyJsPlugin    = require('uglifyjs-webpack-plugin');
const ImageminPlugin    = require('imagemin-webpack-plugin').default;//图片压缩工具
const imageminMozjpeg   = require('imagemin-mozjpeg');//jpg压缩工具

//定义环境变量
const env = require('../config/prod.env');

//与基本配置进行合并
const webpackConfig = merge(baseWebpackConfig, {
    module : {
        rules: utils.styleLoaders({
            sourceMap : config.build.productionSourceMap,
            extract   : true,
            usePostCSS: true
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output : {
        path         : config.build.assetsRoot,
        filename     : utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        //【1】定义变量用来判断环境
        new webpack.DefinePlugin({
            'process.env': env
        }),
        //【2】压缩JS
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap    : config.build.productionSourceMap,
            parallel     : true
        }),
        // extract css into its own file
        //【3】抽离各个入口所依赖的css
        new ExtractTextPlugin({
            filename : utils.assetsPath('css/[name].[contenthash].css'),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            allChunks: true,
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        //【4】duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap
                ? {safe: true, map: {inline: false}}
                : {safe: true}
        }),
        // // generate dist index.html with correct asset hash for caching.
        // // you can customize output by editing /index.html
        // // see https://github.com/ampedandwired/html-webpack-plugin
        // new HtmlWebpackPlugin({
        //   filename: config.build.index,
        //   template: 'index.html',
        //   inject: true,
        //   minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true
        //     // more options:
        //     // https://github.com/kangax/html-minifier#options-quick-reference
        //   },
        //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        //   chunksSortMode: 'dependency'
        // }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // split vendor js into its own file
        //【5】提取PC端node-module中的依赖
        new webpack.optimize.CommonsChunkPlugin({
            name     : 'index/vendor',
            chunks   : getEntryname().pc,
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                );
            }
        }),

        //【6】PC端 extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name     : 'index/manifest',
            chunks   : ['index/vendor'],
            minChunks: Infinity
        }),

        //【7】提取Mobile端node-module中的依赖
        new webpack.optimize.CommonsChunkPlugin({
            name  : 'phone/vendor',
            chunks: getEntryname().phone,
            minChunks(module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                );
            }
        }),

        //【8】Mobile端 extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name     : 'phone/manifest',
            chunks   : ['phone/vendor'],
            minChunks: Infinity
        }),

        // This instance extracts shared chunks from code splitted chunks and bundles them
        // in a separate chunk, similar to the vendor chunk
        // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
        //【9】提取env
        new webpack.optimize.CommonsChunkPlugin({
            name     : 'common/env',
            //async    : 'vendor-async',
            chunks   : getEntryname().all,
            //children: true,
            //minChunks: 3
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../src/config')
                    ) === 0
                );
            }
        }),

        // copy custom static assets
        //【10】复制静态资源
        new CopyWebpackPlugin([
            {
                from  : path.resolve(__dirname, '../static'),
                to    : config.build.assetsSubDirectory,
                ignore: ['.*', 'imgs/*.*']
            },
            {
                from: path.resolve(__dirname, '../.htaccess'),
                to  : config.build.assetsRoot
            },
        ]),

        //【11】图片压缩
        new ImageminPlugin({
            pngquant: {
                quality: '75-80'
            },
            plugins : [
                imageminMozjpeg({
                    quality    : 80,
                    progressive: true
                })
            ]
        }),
    ]
});

//（3）静态资源的压缩
if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset    : '[path].gz[query]',
            algorithm: 'gzip',
            test     : new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio : 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
//（4）根据入口生成多页面
Object.keys(utils.entries()).forEach(function (entry) {
    const entryname = entry.substring(entry.lastIndexOf('/') + 1);
    const entrypre  = entry.substring(0, entry.lastIndexOf('/'));
    let vendor, manifest;
    if (entrypre == 'phone') {
        vendor   = 'phone/vendor';
        manifest = 'phone/manifest';
    } else {
        vendor   = 'index/vendor';
        manifest = 'index/manifest';
    }

    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            filename      : entry + '.html',
            template      : 'src/modules/' + entrypre + '/pages/' + entryname + '/' + entryname + '.pug',
            favicon       : 'favicon.ico',
            inject        : true,
            chunks        : [manifest, vendor, 'common/env', entry],
            minify        : {
                removeComments       : true,
                collapseWhitespace   : true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'manual'
        })
    );
});

//（5）从nodemodule中提取时区分Mobile及PC chunks
function getEntryname() {
    let entryname = {}, pcentry = [], phoneentry = [], allentry = [];

    Object.keys(utils.entries()).forEach(function (entry) {
        allentry.push(entry);
        if (entry.indexOf('phone') == -1) {
            pcentry.push(entry);
        } else {
            phoneentry.push(entry);
        }
    });
    entryname.pc    = pcentry;
    entryname.phone = phoneentry;
    entryname.all   = allentry;

    return entryname;
}

module.exports = webpackConfig;
