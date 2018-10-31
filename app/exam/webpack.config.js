const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './index.js'),
  watch : true,
  output: {
    path: path.resolve(__dirname, '../../dist/exam'),
    filename: process.env.NODE_ENV === 'production' ? 'exam.bundle.[hash].js' : 'example.bundle.js',
    publicPath: '/assets/'
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
    port : 8000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: '测试系统',
      template: path.resolve(__dirname, './index.html'),
      alwaysWriteToDisk : true,
      files : {
        css : ['/assets/codemirror.css'],
        js : ['/assets/codemirror.js']
      }
    }),
  ]

}