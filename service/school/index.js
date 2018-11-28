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
    let mgrs = []
    if (query.managers) {
      for (let i = 0; i < query.managers.length; i++) {
        if(query.managers[i]) {
          const v2 = new Validator(query.managers[i])
          v2.check('id', 'integer', 'id应当是整数')
          v2.check('email', 'required', '需要邮箱')
          v2.check('email', 'email', '邮箱格式不正确')
          v2.validate()
          mgrs.push(query.managers[i])
        }
      }
    }
    query.managers = mgrs


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
  app.put('/my/class', token, bodyParser.json(), api_wrapper(async (req, res) => {
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

  app.get('/my/class/:id', token, api_wrapper(async (req, res) => {

    if(!req.student) {
      throw new LoginException('需要登录')
    }
    const id = req.params.id
    if(!(id + '').match(/^[0-9]+$/)) {
      throw new LogicException('id格式不正确')
    }
    const school = new School()
    const cls = await school.my_class(id, req.student.account_id)
    res.send(cls)
  }))

  app.get('/my/class/:id/apply', token, api_wrapper(async (req, res) => {

    if(!req.student) {
      throw new LoginException('需要登录')
    }
    const id = req.params.id
    if(!(id + '').match(/^[0-9]+$/)) {
      throw new LogicException('id格式不正确')
    }
    const school = new School()
    const cls = await school.my_class_apply(id, req.student.account_id)
    res.send(cls)
  }))

  app.post('/my/class/:id/apply', token, api_wrapper(async (req, res) => {
    if (!req.student) {
      throw new LoginException('需要登录')
    }
    const id = req.params.id
    if (!(id + '').match(/^[0-9]+$/)) {
      throw new LogicException('id格式不正确')
    }
    const school = new School()
     await school.apply_class(id, req.student.account_id)
    res.send({
      success : 1
    })
  }))

  app.delete('/my/class', token, bodyParser.json() ,api_wrapper(async (req, res) => {

    if(!req.student) {
      throw new LoginException()
    }

    const school = new School()


    const id = req.body.id
    if(!(id + '').match(/^[0-9]+$/)) {
      throw new LogicException('id格式不正确')
    }


    await school.delete_class(id, req.student.account_id)

    res.send({
      success : 1
    })

  }))

  app.get('/my/class', token, api_wrapper ( async (req, res) => {

    if(!req.student) {
      throw new LoginException('需要登录')
    }
    const query = req.query
    if(!query.offset) {query.offset = 0}
    if(!query.limit) {query.limit = 20}
    const validator = new Validator(query)
    validator.check('offset', 'integer', 'offset必须是整数')
    validator.check('limit', 'integer', 'limit必须是整数')
    const school = new School()
    const list = await school.my_classes(req.student.account_id, query.offset, query.limit)
    res.send(list)
  }))

  app.get('/my/student', token, api_wrapper( async (req, res) => {
    if(!req.student) {
      throw new LogicException()
    }

    const query = req.query
    if(!query.offset) {query.offset = 0}
    if(!query.limit) {query.limit = 20}
    const validator = new Validator(query)
    validator.check('offset', 'integer', 'offset必须是整数')
    validator.check('limit', 'integer', 'limit必须是整数')

    const school = new School()
    const list = await school.my_student(req.student.account_id, query.offset, query.limit)
    console.log(list)
    res.send(list)

  }))

  app.post('/my/class/student/:id/verify', token, api_wrapper( async (req, res) => {

    if(!req.student) {
      throw new LogicException()
    }

    const id = req.params.id
    if(!id) {
      throw new LogicException('需要id')
    }
    if( !(id + '' ).match(/^\d+$/)) {
      throw new Logicxception('需要整数id')
    }
    const school = new School()
    await school.change_student_status(req.params.id, req.student.account_id, 'verified')
    res.send({
      success : 1
    })
  }))
}

module.exports = register