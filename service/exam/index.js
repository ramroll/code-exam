const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

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
      res.status(400).send(errors[0])
      return
    }

    const exam = new Exam()

    const result = await exam.load(req.query.name)

    res.send(result)
    // res.send('ok')

  }))

}


module.exports = register