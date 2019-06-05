'use strict'

const path              = require('path');//获取路径的方法
const utils             = require('./utils');//公用方法
const webpack           = require('webpack');//webpack
const config            = require('../config');//配置对象
const merge             = require('webpack-merge');//合并工具
const baseWebpackConfig = require('./webpack.base.conf');//获取基本配置
const CopyWebpackPlugin = require('copy-webpack-plugin');//复制工具
const HtmlWebpackPlugin = require('html-webpack-plugin');//HTML工具
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');//CSS去重工具
const UglifyJsPlugin    = require('uglifyjs-webpack-plugin');
const ImageminPlugin    = require('imagemin-webpack-plugin').default;//图片压缩工具
const imageminMozjpeg   = require('imagemin-mozjpeg');//jpg压缩工具


//定义环境变量
const env = require('../config/prod.env');

//与基本配置进行合并
const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    performance: {
        hints: false
    },
    module : {
        rules: utils.styleLoaders({
            sourceMap : config.build.productionSourceMap,
            extract   : true,
            usePostCSS: true
        })

    },
    optimization:{
        minimize: true, //是否进行代码压缩
        splitChunks: {
            cacheGroups: {

                //【1】提取bowser
                bowser: {
                    chunks:'all',
                    test: /[\\/]node_modules[\\/]bowser[\\/]/,
                    name:'common/bowser',
                    priority: 30,
                },

                //【2】提取vuex
                vuex: {
                    chunks:'all',
                    test: /[\\/]node_modules[\\/]vuex[\\/]/,
                    name:'common/vuex',
                    priority: 29,
                },

                //【3】提取（env/config/utils/api/router）配置
                env: {//环境配置
                    chunks:function(chunk){
                        return getEntryname().all
                    },
                    test: /[\\/]src[\\/](api|config|router)[\\/]/,
                    priority: 28,
                    name:'common/env',
                },

                //【4】PC端提取node_module
                indexvendor: {
                    chunks: (chunk) => {
                       const entrypre  = chunk.name.substring(0, chunk.name.lastIndexOf('/'));
                       return entrypre == 'index'
                    },
                    test: /[\\/]node_modules[\\/]/,
                    name:'index/vendor',
                    priority: 27,
                },

                //【5】Mobile端提取node_module
                phonevendor: {//移动端：从node_module中提取
                    chunks: (chunk) => {
                        const entrypre  = chunk.name.substring(0, chunk.name.lastIndexOf('/'));
                        return entrypre == 'phone'
                    },
                    test: /[\\/]node_modules[\\/]/,
                    name:'phone/vendor',
                    priority: 26,
                },

                //【6】PC端提取内部组件公共部分
                indexcommon: {//PC端组件共用部分
                    chunks:'async',
                    test: /[\\/]src[\\/]modules[\\/]index[\\/]/,
                    name:'index/common',
                    minChunks: 2,
                    enforce:true,
                    priority: 25,
                },

                //【7】Mobile端提取内部组件公共部分
                phonecommon: {//移动端组件共用部分
                    chunks:'async',
                    test: /[\\/]src[\\/]modules[\\/]phone[\\/]/,
                    name:'phone/common',
                    minChunks: 2,
                    enforce:true,
                    priority: 24,
                },

                //【8】PC端提取入口文件的公共样式
                index_com_style: {
                    name: 'index/com_style',
                    test: (m, c) => {
                        var cname = c.map((cd) => {
                            return cd.name
                        })
                        return m.constructor.name === 'CssModule' && cname.some((s) => {
                                return s.indexOf('index/') != -1

                            })
                    },
                    chunks: 'initial',
                    enforce: true,
                    priority: 23,
                },

                //【9】Mobile端提取入口文件的公共样式
                phone_com_style: {
                    name: 'phone/com_style',
                    test: (m, c) => {
                        var cname = c.map((cd) => {
                            return cd.name
                        })
                        return m.constructor.name === 'CssModule' && cname.some((s) => {
                                return s.indexOf('phone/') != -1
                            })
                    },
                    chunks: 'initial',
                    enforce: true,
                    priority: 22,
                },
            }
        },
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output : {
        path         : config.build.assetsRoot,
        filename     : utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    plugins: [
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

        //【3】抽离各个入口所依赖的css
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash].css'),
        }),

        //【4】css去重
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap
                ? {safe: true, map: {inline: false}}
                : {safe: true}
        }),

        //根据模块的相对路径生成一个四位数的hash作为模块id
        new webpack.HashedModuleIdsPlugin(),

        // enable scope hoisting
        // new webpack.optimize.ModuleConcatenationPlugin(),

        // //【5】提取PC端node-module中的依赖
        // new webpack.optimize.CommonsChunkPlugin({
        //     name     : 'index/vendor',
        //     chunks   : getEntryname().pc,
        //     minChunks: function (module, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //             module.resource &&
        //             /\.js$/.test(module.resource) &&
        //             module.resource.indexOf(
        //                 path.join(__dirname, '../node_modules')
        //             ) === 0
        //         );
        //     }
        // }),
        //
        // //【6】PC端 extract webpack runtime and module manifest to its own file in order to
        // // prevent vendor hash from being updated whenever app bundle is updated
        // new webpack.optimize.CommonsChunkPlugin({
        //     name     : 'index/manifest',
        //     chunks   : ['index/vendor']
        // }),
        //
        // //【7】提取Mobile端node-module中的依赖
        // new webpack.optimize.CommonsChunkPlugin({
        //     name  : 'phone/vendor',
        //     chunks: getEntryname().phone,
        //     minChunks(module) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //             module.resource &&
        //             /\.js$/.test(module.resource) &&
        //             module.resource.indexOf(
        //                 path.join(__dirname, '../node_modules')
        //             ) === 0
        //         );
        //     }
        // }),
        //
        // //【8】Mobile端 extract webpack runtime and module manifest to its own file in order to
        // // prevent vendor hash from being updated whenever app bundle is updated
        // new webpack.optimize.CommonsChunkPlugin({
        //     name     : 'phone/manifest',
        //     chunks   : ['phone/vendor']
        // }),
        //
        // //【9】提取env
        // new webpack.optimize.CommonsChunkPlugin({
        //     name     : 'common/env',
        //     //async    : 'vendor-async',
        //     chunks   : getEntryname().all,
        //     //children: true,
        //     //minChunks: 3
        //     minChunks: function (module, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //             module.resource &&
        //             /\.js$/.test(module.resource) &&
        //             module.resource.indexOf(
        //                 path.join(__dirname, '../src/config')
        //             ) === 0
        //         );
        //     }
        // }),

        //【10】复制静态资源
        new CopyWebpackPlugin([
            {
                from  : path.resolve(__dirname, '../static'),
                to    : config.build.assetsSubDirectory,
                ignore: ['.*', 'imgs/*.*','lib/**/*.*']
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
    let vendor, comstyle;
    if (entrypre == 'phone') {
        vendor   = 'phone/vendor';
        comstyle = 'phone/com_style';
    } else {
        vendor   = 'index/vendor';
        comstyle = 'index/com_style';
    }
    var etToZh = {
        'index':'首页',
        'video':'视频'
    }
    var page_title = etToZh[entryname] ? etToZh[entryname] : '';

    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            title:page_title,
            filename      : entry + '.html',
            template      : 'src/modules/' + entrypre + '/pages/' + entryname + '/' + entryname + '.pug',
            favicon       : 'favicon.ico',
            inject        : true,
            chunks        : [comstyle,'common/bowser','common/vuex',vendor,'common/env',entry],
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
