'use strict';

var path = require('path');
var webpack = require('webpack');
module.exports = {
    // devtool: 'source-map', // 如果出错，可以知道源文件的位置 -- 这个会使得编译后的js文件变大
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        chunkFilename: '[name].[chunkhash:5].chunk.js'
    },
    devServer: {
        inline: true, // 实时刷新
        historyApiFallback: true,  //不跳转
        port: 9080
    },
    module: {
        loaders: [
            {
                test:/\.css$/,
                //exclude:/node_modules/,
                loader:"style-loader!css-loader"
            }, {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader"
            }, {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            },{
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react',"stage-1"],
                    plugins: ['transform-runtime', ['import', {
                        libraryName: 'antd',
                        style: true // or true or css 这里必须是 css，否则样式不能加载
                    }]]
                }
            }
        ]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            // test: /\.xxx$/, // may apply this only f
            options: {
                babel: {
                    //presets: ['es2015', 'stage-0', 'react'],
                    plugins: ['transform-runtime', ['import', {
                      libraryName: 'antd',
                      style: 'true' // or true
                    }]]
                }
            }
        }),
        new webpack.BannerPlugin('文件头注释写这里吧!'),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:true
            },
                output:{
                comments:true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};