const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const LogicException = require('../../lib/exception/LogicException')
const ExecQueue = require('../../lib/queue/exec_queue')
class Exam{

  constructor(){
    this.db = new Db()
  }


  /**
   * 加载一份试卷
   * @param {*} name
   * @param {*} student_id
   */
  async load(name, student_id, account_id){

    const sql = `select * from exam where name=?`
    const exam = await this.db.queryOne(sql, [name])

    if(!exam) {
      throw new LogicException('试卷不存在')
    }

    const sql2 = `select B.id as question_id,B.title, B.id,A.min_score,A.ref_time,A.weight,B.md,B.sample,B.title from exam_question A
      left join question B
      on A.question_id = B.id
      where A.exam_id=${exam.id}
      order by A.id
    `
    const submits = await this.db.query('select * from submit where exam_id=? and student_id=? order by id desc ', [exam.id, student_id])
    const configs = await this.db.query(sql2)

    const count = configs.length
    const questions = []
    for(let i = 1; i <= count; i++) {
      const question = {}
      const lastSubmit = submits.find(x => x.question === configs[i-1].question_id)
      const successSubmits = submits.filter(x =>(x.status === 2 && x.question === configs[i-1].question_id))
      const fastestSubmit = findMin(x => x.exe_time)(successSubmits)
      const {md,sample, question_id, title} = configs[i-1]
      question.id = question_id
      question.md = md
      question.title = title
      question.sample = sample
      question.console = lastSubmit ? lastSubmit.console : ''
      question.message = lastSubmit ? lastSubmit.message : ''
      question.last_submit_status = lastSubmit ? lastSubmit.status : -1
      question.sample = lastSubmit ? lastSubmit.code : sample
      question.correct = !!fastestSubmit
      question.exe_time = fastestSubmit ? fastestSubmit.exe_time : 0
      questions.push(question)
    }

    const start_time = new Date(exam.start_time).getTime()
    const diff = start_time+ exam.time * 1000 - new Date().getTime()
    const tillstart = start_time - new Date().getTime()
    return {
      name,
      title : exam.title,
      permanent : exam.time === 0,
      left :  diff,
      tillstart,
      questions : (exam.account_id !== account_id) ? (tillstart > 0 ? [] : questions) : questions
    }
  }

  /**
   * 提交代码进行验证
   * @param {*} obj
   * @param {*} student_id
   */
  async submit(obj, student_id) {
    const exam = await this.db.queryOne('select * from exam where name=?', [obj.exam])
    const diff = new Date().getTime() - ( new Date(exam.start_time).getTime() + exam.time*1000)
    if(!(exam.time === 0) && diff > 0) {
      throw new LogicException('已经超出考试时间')
    }


    const submit = {
      student_id,
      exam_id : exam.id,
      question : obj.question_id,
      code : obj.code,
      exam : exam.name
    }


    const id = await this.db.insert('submit', submit)
    const queue = new ExecQueue()
    queue.enqueue(id)
  }


  /**
   * 加载解释
   * @param {*} name
   */
  async explains(name) {
    const sql = `select id from exam where name='${name}'`
    const exam = await this.db.queryOne(sql)
    if(!exam) {
      throw new LogicException('试卷不存在')
    }
    const sql2 = `select * from exam_explain where exam_id='${exam.id}'`
    return await this.db.query(sql2)
  }

  /**
   * 加载解释
   * @param {*} name
   */
  async explain(name, id) {
    const sql = `select id from exam where name='${name}'`
    const exam = await this.db.queryOne(sql)
    if(!exam) {
      throw new LogicException('试卷不存在')
    }
    const sql2 = `select * from exam_explain where id='${id}'`
    return await this.db.queryOne(sql2)
  }


  /**
   * 加载用户的回答
   */
  async answers(name){
    const sql = `select id from exam where name='${name}'`
    const exam = await this.db.queryOne(sql)
    if(!exam) {
      throw new LogicException('试卷不存在')
    } 
    const sql2 = `select * from exam_question where exam_id=${exam.id}`
    const exam_question = await this.db.query(sql2)
    const ids = exam_question.map(x => x.question_id)
    if(ids.length === 0) {
      return []
    }

    const sql3 = `select A.student_id, C.title,A.exe_time, B.nickname, B.avatar,B.name, A.code from submit A
      left join student B
      on A.student_id = B.id
      left join question C
      on A.question = C.id
      where A.question in (${ids.join(',')}) and A.status=2
    `
    const list = await this.db.query(sql3)

    const g = R.groupBy(submit => {
      return submit.student_id + ',' + submit.question
    })(list)

    let groups = []
    for(let key in g) {
      const [student_id, question_id] = key.split(',')
      let min = Number.MAX_SAFE_INTEGER
      let minItem = null
      for(let i = 0; i < g[key].length; i++) {
        const submit = g[key][i]
        if(submit.exe_time < min) {
          min = submit.exe_time
          minItem = submit
        }
      }
      groups.push(minItem)
    }

    return groups


  }
}


function findMin(prediction) {
  return (list) => {
    let min = Number.MAX_SAFE_INTEGER
    let mItem = null
    for(let i = 0; i< list.length; i++) {
      const item = list[i]
      if(prediction(item) < min) {
        min = prediction(item)
        mItem = item
      }
    }
    return mItem

  }


}

module.exports = Exam