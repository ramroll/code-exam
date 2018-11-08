const path = require('path')
const fs = require('fs')
function register(app) {
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../../dist/exam/index.html'))
  })
}

module.exports = register
