const path = require('path')
const express = require('express')
const chalk = require('chalk')
const opts = require('commander')
  .version('1.0.0')
  .usage('[options] <service ...>')
  .option('-p, --port <n>', 'use port')
  .option('-s, --service [service]', 'service name')
  .parse(process.argv)

const port = opts.port
const service = opts.service

if( !( port && service) ) {
  console.error('service or port not specified')
  process.exit(1)
}



function run_service(service, port) {
  const app = require('express')()

  app.use((req,res, next) => {
    console.log('request:', req.path)
    next()
  })
  const base = path.resolve(__dirname, '../../service/', service)
  const register = require(path.resolve(base, 'index.js'))
  register(app)
  app.listen(port)
  console.log( chalk.blue('listening '), port)
}

run_service(service, port)



