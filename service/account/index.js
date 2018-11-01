const Account = require('./dao/account')
const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')
const token = require('../lib/util/token.middleware')
const bodyParser = require('body-parser')
/**
 * 服务注册函数
 * 向express中注册路由
 */
function register(app){


  app.get('/login', token, api_wrapper( async (req, res) => {
    const query = req.query
    const validator = new Validator(query)
    validator.check('email', 'required', '请填写邮箱')
    validator.check('email', 'email', '邮箱格式不正确')
    validator.check('password', 'required', '请填写密码', {min : 6, max : 20})
    validator.check('password', 'len', '密码长度为6-12位', {min : 6, max : 20})
    const errors = validator.validate()
    if(errors.length > 0) {
      res.status(400).send({
        error : errors[0]
      })
      return
    }
    const account = new Account()
    const user = await account.login(query, req.headers.token)
    res.send(account)
  }))

  app.get('/activation', token, api_wrapper( async (req, res) => {
    const validator = new Validator(req.query)
    validator.check('code', 'required', '不完整的激活链接（请重试）')
    validator.check('code', 'len', '不完整的激活链接（请重试）', {
      min : 21,
      max : 21
    })
    const errors = validator.validate()
    if(errors.length > 0) {
      res.status(400).send({
        error : errors[0]
      })
      return
    }

    const account = new Account()
    await account.activation(req.query.code)
    res.send({success : 1})
  }))

  app.post('/register', token, bodyParser.json(), api_wrapper( async (req, res) => {
    console.log(req.body)
    const validator = new Validator(req.body)
    validator.check('email', 'required', '请填写邮箱')
    validator.check('email', 'email', '邮箱格式不正确')
    validator.check('password', 'required', '请填写密码', {min : 6, max : 20})
    validator.check('password', 'len', '密码长度为6-12位', {min : 6, max : 20})
    validator.check('name', 'required', '请输入姓名')
    validator.check('name', /^[\u4e00-\u9fa5]{2,4}$/, '请输入2-4个字中文姓名')
    const errors = validator.validate()
    if(errors.length > 0) {
      res.status(400).send({
        error : errors[0]
      })
      return
    }

    const account = new Account()
    await account.register(req.body)
    res.send({success : 1})
  }))

  app.post('/validate', () => {

  })
}


module.exports = register