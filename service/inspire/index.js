const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

const bodyParser = require('body-parser')
const token = require('../lib/util/token.middleware')
const LogicException = require('../lib/exception/LogicException')
const LoginException = require('../lib/exception/LoginException')

const request_lock = require('../lib/util/request_lock')
/**
 * 服务注册函数
 * 向express中注册路由
 */
function register(app){

  app.get('/my/question', token, api_wrapper( async (req, res) => {

  }))


}


module.exports = register