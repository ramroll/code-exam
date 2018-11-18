const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

const bodyParser = require('body-parser')
const Exam = require('./dao/exam')
const token = require('../lib/util/token.middleware')
const LogicException = require('../lib/exception/LogicException')
const LoginException = require('../lib/exception/LoginException')

const request_lock = require('../lib/util/request_lock')
/**
 * 服务注册函数
 * 向express中注册路由
 */
function register(app){

  app.get('/paper', token, api_wrapper( async (req, res) => {

    if(!req.student) {
      throw new LoginException()
    }

    const validator = new Validator(req.query)
    validator.check('name', 'required', '需要传入试题名称')
    validator.check('name', /[a-z-]{3,20}/, '试题格式不正确')
    validator.validate()

    const exam = new Exam()
    const result = await exam.load(req.query.name, req.student.student_id, req.student.account_id)
    res.send(result)
  }))


  app.post('/submit', token, bodyParser.json(), api_wrapper(async (req, res) => {

    if(!req.student) {
      throw new LoginException()
    }

    request_lock(req.student.student_id + '-submit', 10000)
    const validator = new Validator(req.body)
    validator.check('exam', 'required', '需要传入试题名称')
    validator.check('exam', /[a-z-]{3,20}/, '试题格式不正确')
    validator.check('question_id', 'required', '需要题目id')
    validator.check('question_id', /\d+/, '题目id格式不正确')
    validator.check('code', 'required', '需要代码')
    validator.check('code', 'len', '答案不能超过2000个字符', {
      max : 2000
    })

    validator.validate()
    const {code} = req.body
    const notAllowed = [
      'global',
      'require',
      'module',
      'eval'
    ]


    for(let i = 0; i < notAllowed.length; i++) {
      if(code.match( new RegExp( notAllowed[i]) ) ){
        res.status(400).send({error : `${notAllowed[i]}是保留字.`})
        return
      }
    }

    const exam = new Exam()
    await exam.submit(req.body, req.student.student_id)
    res.send({success : 1})
  }))
}


module.exports = register