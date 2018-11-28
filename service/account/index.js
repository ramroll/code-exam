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

  app.get('/me', token, api_wrapper(async (req, res) => {

    const student = req.student
    if(!student) {
      res.status(400).send({error : '未登录'})
      return
    }
    if(student.status !== 1) {
      res.status(400).send({ error: '未激活' })
      return
    }
    res.send({
      avatar : student.avatar,
      intro : student.intro,
      account_id : student.account_id,
      name : student.name,
      email : student.email,
      nickname : student.nickname
    })
  }))

  app.post('/login', token, bodyParser.json(),api_wrapper( async (req, res) => {
    const query = req.body
    const validator = new Validator(query)
    validator.check('email', 'required', '请填写邮箱')
    validator.check('email', 'email', '邮箱格式不正确')
    validator.check('password', 'required', '请填写密码', {min : 6, max : 20})
    validator.check('password', 'len', '密码长度为6-12位', {min : 6, max : 20})
    validator.validate()
    const account = new Account()
    const user = await account.login(query, req.headers.token)
    res.send({success : 1})
  }))

  app.get('/activation', token, api_wrapper( async (req, res) => {
    const validator = new Validator(req.query)
    validator.check('code', 'required', '不完整的激活链接（请重试）')
    validator.check('code', 'len', '不完整的激活链接（请重试）', {
      min : 21,
      max : 21
    })
    validator.validate()
    const account = new Account()
    await account.activation(req.query.code)
    res.send({success : 1})
  }))

  app.post('/me', token, bodyParser.json(), api_wrapper( async (req, res) => {
    const validator = new Validator(req.body)

    validator.check('name', 'required', '请输入姓名')
    validator.check('name', /^[\u4e00-\u9fa5]{2,4}$/, '请输入2-4个字中文姓名')
    validator.check('nickname', 'required', '请输入昵称')
    validator.check('nickname', /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/, '昵称应当为2-20个字符（不包含特殊字符）')
    validator.check('avatar', 'required', '请选择头像')
    validator.check('avatar', /[a-z0-9-\/]{10,40}\.(jpg|jpeg|png)/, '头像格式不正确')
    validator.check('intro', 'len', '个人介绍最多100个字符', {
      max : 100
    })

    const account = new Account()
    await account.update(req.body, req.student.student_id)
    res.send({
      success : 1
    })
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
    validator.check('nickname', 'required', '请输入昵称')
    validator.check('nickname', /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/, '昵称应当为2-20个字符（不包含特殊字符）')

    validator.validate()

    const account = new Account()
    await account.register(req.body)
    res.send({success : 1})
  }))

}


module.exports = register