const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const LogicException = require('../../lib/exception/LogicException')
const MaxHeap = require('./heap')


function sum(obj) {
  return Object.values(obj).reduce((x, y) => {
    return x + y
  }, 0)
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
    if(min_score === 100) {return weight}
    const lg_real = Math.log2(real_exe_time)
    const lg_refer = Math.log2(refer_exe_time)

    let diff = lg_refer - lg_real

    let addScore = 50
    if(diff < 0) {
      addScore += diff * 10
    }
    else {
      addScore += diff * 14 
    }

    if(addScore > 100) {
      addScore = 100
    }
    if(addScore < 0) {
      addScore = 0
    }

    let score = min_score + (addScore  / 2)
    weight = weight / 100
    console.log('score', diff, refer_exe_time, real_exe_time, score)
    return score * weight
  }


  async loadExamConfs() {

    const sql = `select A.question_id, B.name, A.min_score, A.ref_time, A.weight from exam_question A
      left join exam B
      on B.id = A.exam_id
    `
    const items = await this.db.query(sql)
    const conf = {}

    for(let i = 0; i < items.length; i++) {
      const {name, min_score, ref_time, weight, question_id} = items[i]

      if(!conf[name]) {
        conf[name] = {
          count : 0,
          scores : {}
        }
      }

      conf[name].scores[question_id] = {
        min_score,
        ref_time,
        weight
      }
      conf[name].count ++
    }
    return conf
  }

  async buildRank() {
    const exam_names = ( await this.db.query(`select distinct(exam) from submit`) ).map(x => x.exam)
    this.conf = await this.loadExamConfs()

    const sql = `
      select A.id, A.exam, A.student_id, A.status, A.question, A.exe_time,B.email, B.nickname
      from submit A
      left join student B
      on A.student_id = B.id
      where status>=2 and A.id > ${this.max_id}
    `
    const submits = await this.db.query(sql)


    for(let i = 0; i < submits.length; i++) {
      const {id, email, exam, student_id, question , status, exe_time, nickname}= submits[i]
      if(!email) {continue}

      if(this.max_id < id) {
        this.max_id = id
      }
      if(!this.conf[exam]) {
        continue
      }

      if(!this.exams[exam]) {
        this.exams[exam] = {
          users : {}
        }
      }
      const {scores,count} = this.conf[exam]

      // 初始化为0分
      if(!this.exams[exam].users[student_id]) {
        this.exams[exam].users[student_id] = {
          nickname,
          email : hide(email),
          scores : {},
          total : 0
        }
      }
      const users = this.exams[exam].users

      // 对当前submit打分
      const question_id = question
      const score = this.score(
        exe_time,
        scores[question_id].ref_time,
        scores[question_id].min_score,
        status === 2,
        scores[question_id].weight
      )
      if(!users[student_id].scores[question_id]) {
        users[student_id].scores[question_id] = 0
      }
      if (users[student_id].scores[question_id] < score) {
        users[student_id].scores[question_id] = score
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