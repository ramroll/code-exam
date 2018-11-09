const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const express = require('express')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HappyPack = require('happypack')
const PUBLIC_PATH = (process.env.NODE_ENV === 'production') ?
  '//s.weavinghorse.com/' : '/'


const babelLoaderOptions = {
  presets: [
    [
      '@babel/env'
    ],
    '@babel/react'
  ],
  plugins : [
    ['@babel/plugin-syntax-dynamic-import'],
    ['@babel/plugin-proposal-decorators', {"legacy" : true}],
    'babel-plugin-transform-class-properties',
    ['babel-plugin-import', {
      "libraryName": "antd",
      style : true
    }]
  ]
}
const config = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  devtool : process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'none',
  entry: path.resolve(__dirname, './index.js'),
  watch : process.env.NODE_ENV === 'development',
  output: {
    path: path.resolve(__dirname, '../../dist/exam'),
    filename: process.env.NODE_ENV === 'production' ? 'exam.bundle.[hash].js' : 'exam.bundle.js',
    publicPath: PUBLIC_PATH
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude : /node_modules/,
        loader: process.env.NODE_ENV === 'development' ? 'babel-loader' : 'happypack/loader',
        options : process.env.NODE_ENV === 'development' ? babelLoaderOptions : {}
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
      },
      {
        test : /\.(jpg|jpeg|gif|svg|png)$/,
        loader : 'file-loader'
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
    port : process.env.PORT,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '算法训练',
      template: path.resolve(__dirname, './index.html'),
      alwaysWriteToDisk : true
    }),

  ],
  resolve : {
    alias : {
      '@ant-design/icons/lib/dist' : path.resolve(__dirname, '../icons/index.js')
    }
  }

}

if(process.env.BUNDLE_ANALYZE) {
  config.plugins.push(new BundleAnalyzerPlugin())
}

if(process.env.NODE_ENV === 'development') {
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin())
  console.log(config)
} else {
  config.plugins.push(new HappyPack({
    threads: 4,
    loaders: [
      {
        loader: 'babel-loader',
        options: babelLoaderOptions
      }
    ]

  }))

}

module.exports = config