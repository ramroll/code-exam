const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')
const token = require('../lib/util/token.middleware')
const bodyParser = require('body-parser')
const Rank = require('./dao/rank')

const rank = new Rank()
/**
 * 服务注册函数
 * 向express中注册路由
 */
async function register(app){

  /** 进行一次rank build */
 await rank.buildRank()
  /** 每过5s钟再build一次 */
  setInterval( async () => {
    await rank.buildRank()
  }, 1000)

  app.get('/top100', api_wrapper( async (req, res) => {
    const query = req.query
    const validator = new Validator(query)
    validator.check('name', 'required', '需要试卷名称')
    validator.check('name', /^[0-9a-z-]{3,20}$/, '试卷名格式不正确')
    validator.validate()
    const name = query.name
    const ranks = rank.getExam(name)
    console.log('rank', ranks)
    res.send(ranks)
  }))


  app.get('/submit/:exam/:question', api_wrapper(async (req, res) => {
    const query = {...req.params, ...req.query}
    if(!query.offset) {
      query.offset = 0
    }
    if(!query.limit) {
      query.limit = 20
    }
    const validator = new Validator(query)
    validator.check('exam', 'required', '需要试卷名称')
    validator.check('question', 'required', '需要试卷id')
    validator.check('exam', /^[0-9a-z-]{3,20}$/, '试卷名称不正确')
    validator.check('question', 'integer', '需要整数id')
    validator.check('offset', 'integer', 'offset格式不正确')
    validator.check('limit', 'integer', 'limit格式不正确', {
      min : 10,
      max : 50
    })
    validator.validate()
    query.offset = Number(query.offset)
    query.limit = Number(query.limit)
    res.send(rank.getQuestions(req.params.exam, req.params.question, query.offset, query.limit))
  }))
}


  module.exports = register