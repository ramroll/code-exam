const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

const bodyParser = require('body-parser')
const Exam = require('./dao/exam')
/**
 * 服务注册函数
 * 向express中注册路由
 */
function register(app){

  app.get('/paper', api_wrapper( async (req, res) => {
    const validator = new Validator(req.query)
    validator.check('name', 'required', '需要传入试题名称')
    validator.check('name', /[a-z-]{3,20}/, '试题格式不正确')
    const errors = validator.validate()
    if(errors.length > 0) {
      res.status(400).send({error : errors[0]})
      return
    }
    const exam = new Exam()
    const result = await exam.load(req.query.name)
    res.send(result)
  }))


  app.post('/submit', bodyParser.json(), api_wrapper(async (req, res) => {

    const validator = new Validator(req.body)
    validator.check('exam', 'required', '需要传入试题名称')
    validator.check('exam', /[a-z-]{3,20}/, '试题格式不正确')
    validator.check('index', 'required', '需要题目序号')
    validator.check('index', /\d+/, '题目需要格式不正确')
    validator.check('code', 'required', '需要代码')

   const errors = validator.validate()
    if(errors.length > 0) {
      res.status(400).send({error : errors[0]})
      return
    }

    const {code, exam, index} = req.body

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



    res.send('ok')

  }))
}


module.exports = register