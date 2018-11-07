const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')
const token = require('../lib/util/token.middleware')
const bodyParser = require('body-parser')
const Rank = require('./dao/rank')

/**
 * 每个试卷的排名
 * ranks :
 *  [exam] : MaxHeap
 */
let ranks = {}

/**
 * 服务注册函数
 * 向express中注册路由
 */
async function register(app){

  /** 进行一次rank build */
  ranks = await rank.buildRank(ranks)
  console.log(ranks)
  /** 每过5s钟再build一次 */
  // setInterval( async () => {
  //   ranks = await rank.buildRank(ranks)
  // }, 5000)

  app.get('/top100', api_wrapper( async (req, res) => {
    const query = req.query
    const validator = new Validator(query)
    validator.check('name', 'required', '需要试卷名称')
    validator.check('name', /[a-z-]{3,20}/, '试卷名格式不正确')
    validator.validate()
    const name = query.name
    if(ranks[name]) {
      res.send( ranks[name].getSorted(100) )
    }
    else {
      ranks[name] = null // 写入一个key，下面会检查这个key看是否需要更新排名
      res.send([])
    }
  }))
}


module.exports = register