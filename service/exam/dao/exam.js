const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const LogicException = require('../../lib/exception/LogicException')
class Exam{

  constructor(){
    this.db = new Db()
  }


  /**
   * 加载一份试卷
   * @param {*} name
   * @param {*} student_id
   */
  async load(name, student_id){

    const dir = path.resolve(process.env.EXAM_DIR, name)
    console.log('dir', dir)
    if(!fs.existsSync(dir)) {
      throw new LogicException('试卷不存在')
    }
    const files = fs.readdirSync(dir)
    const count = files.filter(x => x.match(/\.md$/)).length

    const questions = []

    const sql = `select * from exam where name=?`
    const exam = await this.db.queryOne(sql, [name])
    if(!exam) {
      throw new LogicException('试卷不存在')
    }

    const submits = await this.db.query('select * from submit where exam_id=? and student_id=? order by id desc ', [exam.id, student_id])

    for(let i = 1; i <= count; i++) {

      const lastSubmit = submits.find(x => x.question === i - 1)
      const successSubmits = submits.filter(x =>(x.status === 2 && x.question === i - 1))
      const fastestSubmit = findMin(x => x.exe_time)(successSubmits)
      const question = {}
      const md = fs.readFileSync(path.resolve(dir, i + '.md'), 'utf-8')
      const sample = fs.readFileSync(path.resolve(dir, i + '.sample.js'), 'utf-8')
      question.md = md
      question.message = lastSubmit ? lastSubmit.message : ''
      question.last_submit_status = lastSubmit ? lastSubmit.status : -1
      question.sample = lastSubmit ? lastSubmit.code : sample
      question.correct = !!fastestSubmit
      question.exe_time = fastestSubmit ? fastestSubmit.exe_time : 0
      questions.push(question)
    }

    const created_time = new Date(exam.created).getTime()
    const diff = created_time + exam.time * 1000 - new Date().getTime()

    return {
      name,
      title : '测试卷1',
      left :  diff > 0 ? diff : 0,
      questions
    }
  }

  /**
   * 提交代码进行验证
   * @param {*} obj
   * @param {*} student_id
   */
  async submit(obj, student_id) {
    const exam = await this.db.queryOne('select * from exam where name=?', [obj.exam])
    const diff = new Date().getTime() - ( new Date(exam.created).getTime() + exam.time*1000)
    if(diff > 0) {
      throw new LogicException('已经超出考试时间')
    }

    const lastSubmit = await this.db.queryOne('select * from submit where question=? and exam_id = ? and status=0', [obj.index, exam.id])
    if(lastSubmit) {
      throw new LogicException('您上次提交的代码正在验证')
    }
    const submit = {
      student_id,
      exam_id : exam.id,
      question : obj.index,
      code : obj.code,
      exam : exam.name
    }

    await this.db.insert('submit', submit)
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