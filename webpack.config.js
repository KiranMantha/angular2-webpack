'use strict';

const HtmlWebpack = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const ChunkWebpack = webpack.optimize.CommonsChunkPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackPreBuildPlugin = require('pre-build-webpack');
const del = require('del');


const rootDir = path.resolve(__dirname);
const buildFolder = path.resolve(__dirname, 'dist');


module.exports = {
    devtool: 'source-map',
    entry: {
        app: path.resolve(rootDir, 'src', 'bootstrap'),
        vendor: path.resolve(rootDir, 'src', 'vendor'),
        style: path.resolve(rootDir, 'src/Styles', 'app')
    },
    module: {
        loaders: [{
                loader: 'raw',
                test: /\.(css|html)$/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    'style', // backup loader when not building .css file
                    'css!sass' // loaders to preprocess CSS
                )
            },
            {
                exclude: /node_modules/,
                loader: 'ts',
                test: /\.ts$/
            }
        ]
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: buildFolder
    },
    plugins: [
        new WebpackPreBuildPlugin(function (stats) {
            del([buildFolder]);
        }),
        new ChunkWebpack({
            filename: 'js/vendor.bundle.js',
            minChunks: Infinity,
            name: 'vendor'
        }),
        new HtmlWebpack({
            filename: 'index.html',
            inject: 'body',
            template: path.resolve(rootDir, 'src', 'index.html')
        }),
        new ExtractTextPlugin('css/[name].css')
    ],
    resolve: {
        extensions: ['', '.js', '.ts', '.scss']
    }
};