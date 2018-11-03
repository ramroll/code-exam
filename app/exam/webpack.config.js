const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const express = require('express')

const PUBLIC_PATH = (process.env.NODE_ENV === 'production') ?
  '//t.weavinghorse.com/' : '/'

const config = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  devtool : process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'none',
  entry: path.resolve(__dirname, './index.js'),
  watch : process.env.NODE_ENV === 'development',
  output: {
    path: path.resolve(__dirname, '../../dist/exam'),
    filename: process.env.NODE_ENV === 'production' ? 'exam.bundle.[hash].js' : 'example.bundle.js',
    publicPath: PUBLIC_PATH
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname),
        ],
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/env'
            ],
            '@babel/react'
          ],
          plugins : [
            ['@babel/plugin-proposal-decorators', {"legacy" : true}],
            'babel-plugin-transform-class-properties',
            ['babel-plugin-import', {
              "libraryName": "antd",
              style : true
            }]
          ]
        }
      },
      {
        test : /\.styl$/,
        loader : 'style-loader!css-loader!stylus-loader'
      },
      {
        test : /\.less$/,
        loader : 'style-loader!css-loader!less-loader?javascriptEnabled=true'
      },
      {
        test : /\.css$/,
        loader : 'style-loader!css-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../../dist/exam'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
    port : 8000,
    // before : function(app, server) {
    //   app.use('/static/',express.static(path.resolve(__dirname, '../../static')))
    // }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: '测试系统',
      template: path.resolve(__dirname, './index.html'),
      alwaysWriteToDisk : true
    }),
  ]

}

if(process.env.NODE_ENV === 'production') {
  config.plugins.shift()
}

module.exports = config