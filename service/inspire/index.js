const Validator = require('../lib/query/validator')
const api_wrapper = require('../lib/util/api_wrapper')

const bodyParser = require('body-parser')
const token = require('../lib/util/token.middleware')
const LogicException = require('../lib/exception/LogicException')
const LoginException = require('../lib/exception/LoginException')

const Inspire = require('./dao/inspire')

/**
 * 服务注册函数
 * 向express中注册路由
 */
function register(app){

  app.get('/my/question', token, api_wrapper( async (req, res) => {
    if(!req.student) {
      throw new LoginException('没有登录')
    }
    const query = req.query
    const validator = new Validator(query)
    query.offset = query.offset || 0
    query.limit = query.limit || 20
    validator.check('offset', 'integer', 'offset必须是整数')
    validator.check('limit', 'integer', 'offset必须是10-50之间的整数', {
      min : 10,
      max : 50
    })
    validator.validate()
    const inspire = new Inspire()
    const questions = await inspire.questions(req.student.account_id, query.offset, query.limit)
    res.send(questions)
  }))


  app.get('/my/question/:id', token, api_wrapper(async (req, res)=>{
    const id = req.params.id
    if(!id.match(/^\d+$/)) {
      throw new LogicException('id格式不正确')
    }
    const inspire = new Inspire()
    const question = await inspire.question(id)
    res.send(question)
  }))

  function validateQuestion(req){
    const validator = new Validator(req.body)

    if (req.method === 'PUT') {
      validator.check('id', 'required', '需要id')
      validator.check('id', 'integer', '需要整数id')
    }
    validator.check('title', 'required', '请填写标题')
    validator.check('title', 'len', '标题字数应该为2-30个字', {
      min : 2,
      max : 30
    })
    validator.check('md', 'required', '请填写题目内容')
    validator.check('md', 'len', '题目内容应当为10-3000个字符', {
      min : 10,
      max : 1000
    })
    validator.check('sample', 'required', '请填写示例程序')
    validator.check('sample', 'len', '题目内容应当为10-200', {
      min : 10,
      max : 200
    })
    validator.check('tester', 'required', '请填写测试程序')
    validator.check('tester', 'len', '测试程序应当为20-3000个字符', {
      min: 10,
      max: 3000
    })
    validator.validate()
  }
  app.put('/my/question', token, bodyParser.json(), api_wrapper( async (req, res) => {
    validateQuestion(req)
    const inspire = new Inspire()

    await inspire.put_question({
      ...req.body,
      account_id : req.student.account_id
    })

    res.send({
      success : 1
    })
  }))


  app.post('/my/question', token, bodyParser.json(), api_wrapper(async (req, res) => {
    validateQuestion(req)
    const inspire = new Inspire()

    await inspire.put_question({
      md : req.body.md,
      title : req.body.title,
      tester : req.body.tester,
      sample : req.body.sample,
      account_id : req.student.account_id
    })

    res.send({
      success : 1
    })
  }))



  app.delete('/my/question', token, bodyParser.json(), api_wrapper(async (req, res) => {
    const validator = new Validator(req.body)
    validator.check('id', 'required', '需要id')
    validator.check('id', 'integer', '需要整数id')

    validator.validate()
    const inspire = new Inspire()
    await inspire.delete_question(req.body.id)
    res.send({
      success: 1
    })
  }))

  app.get('/my/paper', token, api_wrapper( async (req, res) => {
    if(!req.student) {
      throw new LoginException('没有登录')
    }
    const query = req.query
    const validator = new Validator(query)
    query.offset = query.offset || 0
    query.limit = query.limit || 20
    validator.check('offset', 'integer', 'offset必须是整数')
    validator.check('limit', 'integer', 'offset必须是10-50之间的整数', {
      min : 10,
      max : 50
    })
    validator.validate()
    const inspire = new Inspire()
    const papers = await inspire.exams(req.student.account_id, query.offset, query.limit)
    res.send(papers)
  }))

  app.get('/my/paper/:id', token, api_wrapper( async (req, res) => {
    const id = req.params.id
    if(!id.match(/^\d+$/)) {
      throw new LogicException('id格式不正确')
    }
    const inspire = new Inspire()
    const paper = await inspire.paper(id)
    res.send(paper)
  }))


  async function validateExam(req, inspire) {

    const validator = new Validator(req.body)
    if (req.method === 'PUT') {
      validator.check('id', 'required', '需要id')
      validator.check('id', 'integer', '需要整数id')
    }

    validator.check('title', 'required', '请填写标题')
    validator.check('title', 'len', '试卷标题字数应当在4-20个字符')
    validator.check('name', 'required', '请填写试卷名称')
    validator.check('name', /^[a-z][a-z0-9-]{3,19}$/, '试卷名称应当4-20个小写字母、数字和-')
    validator.check('time', 'required', '请填写时间')
    validator.check('time', 'integer', '时间应当是大于等于0的整数', {
      min : 0
    })

    const list = req.body.list
    validator.validate()
    if(!list || !Array.isArray(list)) {
      throw new LogicException('需要至少1个问题')
    }

    if (req.method === 'POST') {

      const dup = await inspire.exists_exam(req.body.name)
      if (dup) {
        throw new LogicException('名称为' + req.body.name + '的试卷已经存在')
      }

    }

    let q_list = []
    for(let i = 0; i < list.length; i++) {
      const question = list[i]
      const v = new Validator(question)
      v.check('question_id', 'required', '请填写问题id')
      v.check('qestion_id', 'integer', '问题id应当是整数')
      v.check('min_score', 'required', '请填写最小分值')
      v.check('min_score', 'integer', '最小分值应当为大于0-100的整数', {
        min : 0,
        max : 100
      })
      v.check('ref_time', 'required', '请填写参考执行时间')
      v.check('ref_time', 'integer', '参考时间应当为大于0的整数', {
        min : 1
      })
      v.check('weight', 'required', '请填写权重')
      v.check('weight', 'integer', '权重应当是1-100的整数', {
        min : 1,
        max : 100
      })
      v.validate()

      if(! (await inspire.question(question.question_id))){
        throw new LogicException('编号为' + question.id +'的试题不存在')
      }
    }

  }

  app.post('/my/paper', token,bodyParser.json(), api_wrapper( async (req, res) => {
    if(!req.student) {
      throw new LoginException('没有登录')
    }
    const inspire = new Inspire()
    await validateExam(req, inspire)

    await inspire.put_paper(req.body, req.student.account_id)
    res.send({
      success : 1
    })
  }))


  app.put('/my/paper', token,bodyParser.json(), api_wrapper( async (req, res) => {
    if(!req.student) {
      throw new LoginException('没有登录')
    }
    const inspire = new Inspire()
    await validateExam(req, inspire)

    delete req.body.created
    req.body.list.forEach(x => {
      delete x.created
    })
    await inspire.put_paper(req.body, req.student.account_id)
    res.send({
      success : 1
    })
  }))

  app.delete('/my/paper', token, bodyParser.json(), api_wrapper(async (req, res) => {
    if(!req.student) {
      throw new LoginException('没有登录')
    }
    const validator = new Validator(req.body)
    validator.check('id', 'required', '需要id')
    validator.check('id', 'integer', '需要整数id')

    const inspire = new Inspire()
    await inspire.delete_paper(req.body.id)
    res.send({
      success : 1
    })
  }))


}


module.exports = register