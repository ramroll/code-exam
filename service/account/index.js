const Account = require('./dao/account')
const Validator = require('../query/validator')
/**
 * 服务注册函数
 * 向express中注册路由
 */
function register(app){

  app.get('/login', api_wrapper( async (req, res) => {
    const query = req.query
    const validator = new Validator(query)
    validator.check('email', 'required', '请填写邮箱')
    validator.check('email', 'email', '邮箱格式不正确')
    validator.check('passwd', 'required', '请填写密码', {min : 6, max : 20})
    validator.check('passwd', 'len', '密码长度为6-12位', {min : 6, max : 20})
    const errors = validator.validate()
    if(errors.length > 0) {
      res.status(400).send({
        error : errors[0]
      })
      return
    }

    const account = new Account()
    await account.login(query)
    res.send(account)
  }))

  app.post('/register', () => {

  })

  app.post('/validate', () => {

  })
}


function api_wrapper(func){

  return async (req, res) => {
    try{
      await func(req, res)
    } catch(ex) {
      console.error(ex)
      res.status(500).send({
        error : 'Internal Server Error'
      })
    }
  }
}
module.exports = register