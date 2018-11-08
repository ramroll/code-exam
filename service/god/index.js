const path = require('path')
const fs = require('fs')
/**
 * 全局服务注册函数
 * 向express中注册路由
 */
function register(app) {
    app.get('/supportm', function(req, res) {
      res.sendFile(path.resolve(__dirname, '../../dist/exam/index.html'))
    })
}

module.exports = register
