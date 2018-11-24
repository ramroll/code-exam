const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

const bodyParser = require('body-parser')
const token = require('../lib/util/token.middleware')
const LogicException = require('../lib/exception/LogicException')
const LoginException = require('../lib/exception/LoginException')

const School = require('./school_dao')


function register(app) {
  app.get('/my/class', token, (req, res) => {

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
  })
}

module.exports = register