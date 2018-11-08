const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const path = require('path')
const express = require('express')

const APP = process.env.APP
const webpackOptions = require( path.resolve( __dirname, '../../app/', APP, 'webpack.config.js') )
const compiler = webpack(webpackOptions)

const app = express()
const devServerConfig = webpackOptions.devServer

app.use(middleware(compiler, {
  publicPath : webpackOptions.output.publicPath
}))
app.listen(devServerConfig.port, () => {
  console.log( 'app listen on port ' + devServerConfig.port)
})
