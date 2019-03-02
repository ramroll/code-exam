/**
 * 班级情况统计
 */

const Db = require('../../lib/db/db')
const R = require('ramda')



class ClassStat {


  constructor(){
    this.stats = {}
    this.db = new Db()


  }

  async run(){

    const classes = await this.db.query(`select * from class`)
    const exams = await this.db.query('select * from exam')

    for(let class_ of classes) {
      for (let exam of exams) {
        if(exam.tag === 'courseI') {
          await this.updateClassStat(class_, exam)
        }
      }
    }

  }


  async updateClassStat(class_, exam){

    const account_ids = (await this.db.query(`select account_id from class_student where class_id=${class_.id}`))
      .map(x => x.account_id)

    const students = await this.db.query(`select * from student where account_id in (${account_ids.join(',')})`)
    const question_ids = (await this.db.query(`select * from exam_question where exam_id=${exam.id}`)).map(x=>x.question_id)
    const questions = (await this.db.query(`select * from question where id in (${question_ids.join(',')})`))

    // 获取学生们所有的提交
    const sql = `
      select A.id, A.exam, A.code, A.student_id, A.status, A.question, A.exe_time,B.email, B.nickname,B.avatar
      from submit A
      left join student B
      on A.student_id = B.id
      where A.exam='${exam.name}' and B.account_id in (${account_ids.join(',')}) and status=2
      order by A.id desc
    `

    const submits = await this.db.query(sql)
    const groupByStudent = R.groupBy(x => x.student_id + '-' + x.question, submits)

    const results = []
    for(let question of questions) {
      for(let student of students) {
        const hash = student.id + '-' + question.id


        const submits = groupByStudent[hash] || []

        const basic = {
          name : student.name,
          avatar : student.avatar,
          nickname : student.nickname,
          success : submits.length > 0,
          exe_time : submits.length > 0 ? submits[0].exe_time : 0
        }

        results.push(basic)

      }
    }

    if (!this.stats[class_.id]) {
      this.stats[class_.id] = {
        info : class_,
        exams : {}
      }
    }
    this.stats[class_.id].exams[exam.name] = results
  }

  get(id, exam = '') {
    if(!this.stats[id]) {
      return []
    }
    const {exams, info} = this.stats[id]


    const examsList = Object.keys(exams).map(key => {
      return {
        name : key,
        list : exams[key]
      }
    })

    info.exams = examsList.map(x => x.name)


    return {
      info,
      exam : exam === '' ? examsList[0] : examsList.find(x => x.name === exam)}
  }

}
module.exports = ClassStat