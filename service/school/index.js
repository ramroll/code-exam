const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

const bodyParser = require('body-parser')
const token = require('../lib/util/token.middleware')
const LogicException = require('../lib/exception/LogicException')
const LoginException = require('../lib/exception/LoginException')

const School = require('./school_dao')


function register(app) {

  function validateClass(req){

    const query = req.body

    const validator = new Validator(query)
    if(req.method === 'PUT') {
      query.id = req.params.id
      validator.check('id', 'required', '需要id')
      validator.check('id', 'integer', 'id应当为整数')
    }
    

    validator.check('name', 'required', '需要班级名称')
    validator.check('name', 'len', '班级名称应当为2-20个字符', {
      min : 2,
      max : 20
    })
    validator.check('intro', 'required', '需要班级介绍')
    validator.check('intro', 'len', '班级名称应当为10-50个字符', {
      min : 2,
      max : 50
    })

    validator.validate()

  }
  app.post('/my/class', token, bodyParser.json(), api_wrapper(async (req, res) => {
    if(!req.student) {
      throw new LoginException()
    }
    validateClass(req)
    const school = new School()
    await school.put_class(req.body, req.student.account_id)
    res.send({
      success : 1
    })
  }))
  app.put('/my/class', token, api_wrapper(async (req, res) => {
  }))
  app.get('/my/class', token, api_wrapper ( async (req, res) => {

    if(!req.student) {
      throw new LoginException('需要登录')
    }
    const query = req.query
    if(!query.offset) {
      query.offset = 0
    }
    if(!query.limit) {query.limit = 20}
    const validator = new Validator(query)
    validator.check('offset', 'integer', 'offset必须是整数')
    validator.check('limit', 'integer', 'limit必须是整数')
    const school = new School()
    const list = await school.my_classes(req.student.account_id, query.offset, query.limit)
    res.send(list)
  }))
}

module.exports = register