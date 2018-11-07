const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const LogicException = require('../../lib/exception/LogicException')
const MaxHeap = require('./heap')


function sum(list) {
  return list.reduce((x, y) => x + y, 0)
}

function hide(email) {
  const prts = email.split('@')
  return prts[0].substr(0, 3) + '**..' + '@' + prts[1]
}

/**
 * 排名
 */
class Rank {
  constructor(){
    this.db = new Db()
    this.max_id = -1
    this.exams = {}
  }

  /**
   * 对一次回答进行打分
   */
  score(real_exe_time, refer_exe_time, min_score, correct, weight){
    if(!correct) {return 0}
    const lg_real = Math.log2(real_exe_time)
    const lg_refer = Math.log2(refer_exe_time)

    const diff = lg_refer - lg_real


    console.log('diff', diff, 'ref=', refer_exe_time)
    let score = 50 + (diff > 0 ? diff * (50 / 2) : diff * (50 / 5))
    if(score > 100) {score = 100}
    if(score < min_score) {score = min_score}

    weight = weight / 100
    console.log('score', real_exe_time, refer_exe_time, score, weight)
    return score * weight
  }


  loadExamConfs() {
    const dir = path.resolve(process.env.EXAM_DIR)
    if(!fs.existsSync(dir)) {
      throw new LogicException('试卷不存在')
    }
    const exams = fs.readdirSync(dir)
    let conf = {}
    for(let i = 0; i < exams.length; i++) {
      const exam = exams[i]
      const scores = require(path.resolve(dir, exam, 'scores.config.js'))
      // console.log('files', fs.readdirSync(path.resolve(dir, exam)))
      const count = fs.readdirSync(path.resolve(dir, exam)).filter(x => x.match(/\.md$/)).length
      conf[exam] = {
        scores,
        count
      }
    }
    return conf
  }

  loadExamConf(name) {
    const dir = path.resolve(process.env.EXAM_DIR, name)
    if(!fs.existsSync(dir)) {
      throw new LogicException('试卷不存在')
    }
    const scores = require(path.resolve(dir, 'scores.config.js'))
    const count = fs.readdirSync(path.resolve(dir)).filter(x => x.match(/\.md$/)).length
    return {scores,count}
  }

  async buildRank() {
    const exam_names = ( await this.db.query(`select distinct(exam) from submit`) ).map(x => x.exam)
    this.conf = this.loadExamConfs()

    const sql = `
      select A.id, A.exam, A.student_id, A.status, A.question, A.exe_time,B.email, B.nickname
      from submit A
      left join student B
      on A.student_id = B.id
      where status>=2 and A.id > ${this.max_id}
    `
    const submits = await this.db.query(sql)


    for(let i = 0; i < submits.length; i++) {
      const {id, exam, student_id, question , status, exe_time, nickname, email}= submits[i]

      if(this.max_id < id) {
        this.max_id = id
      }
      if(!this.conf[exam]) {
        this.conf[exam] = this.loadExamConf(exam)
      }

      if(!this.exams[exam]) {
        this.exams[exam] = {
          users : {}
        }
      }
      const {scores,count} = this.conf[exam]
      // console.log('count', count)

      // 初始化为0分
      if(!this.exams[exam].users[student_id]) {
        this.exams[exam].users[student_id] = {
          nickname,
          email : hide(email),
          scores : Array(count).fill(0),
          total : 0
        }
      }
      const users = this.exams[exam].users

      // 对当前submit打分
      const index = question
      const score = this.score(
        exe_time,
        scores[index].exe_time,
        scores[index].min_score,
        status === 2,
        scores[index].weight
      )
      if (users[student_id].scores[index] < score) {
        users[student_id].scores[index] = score
        users[student_id].total = sum(users[student_id].scores)
      }
    }

    // 数据放到maxHeap中
    const ranks = {}
    for (let exam in this.exams) {
      if(!ranks[exam]) {
        ranks[exam] = new MaxHeap(
          (a, key) => a.score = key,
          a => a.score
        )
      }

      const maxHeap = ranks[exam]
      const users = this.exams[exam].users
      Object.keys(users).forEach(student_id => {
        const user = users[student_id]
        maxHeap.add({
          name: user.nickname,
          email: user.email,
          score: user.total
        })
      })

    }
    return ranks
  }

}

module.exports = Rank