const path = require('path')
const fs = require('fs')
function register(app) {
  app.get(/\/account/, function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../dist/account/index.html'))
  })
  app.get(/\/inspire/, function(req, res){
    res.sendFile(path.resolve(__dirname, '../../dist/inspire/index.html'))
  })
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../../dist/exam/index.html'))
  })
}

module.exports = register