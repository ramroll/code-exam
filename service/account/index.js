const Account = require('./dao/account')
const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')
/**
 * 服务注册函数
 * 向express中注册路由
 */
function register(app){

  app.get('/login', api_wrapper( async (req, res) => {
    const query = req.query
    console.log(query)
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


module.exports = register