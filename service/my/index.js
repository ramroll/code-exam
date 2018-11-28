const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

const bodyParser = require('body-parser')
const token = require('../lib/util/token.middleware')
const LogicException = require('../lib/exception/LogicException')
const LoginException = require('../lib/exception/LoginException')

const My = require('./my_dao')


function register(app) {

  app.get('/class', token, api_wrapper(async (req, res) => {

    if(!req.student) {
      throw new LoginException()
    }
    const my = new My()
    const list = await my.classes(req.student.account_id)
    res.send(list)
  }))
}

module.exports = register