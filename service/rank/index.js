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
  }, 5000)

  app.get('/top100', api_wrapper( async (req, res) => {
    const query = req.query
    const validator = new Validator(query)
    validator.check('name', 'required', '需要试卷名称')
    validator.check('name', /[a-z-]{3,20}/, '试卷名格式不正确')
    validator.validate()
    const name = query.name
    const ranks = rank.getExam(name)
    console.log('rank', ranks)
    res.send(ranks)
  }))
}


  module.exports = register