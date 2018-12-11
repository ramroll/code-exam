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

    // 根据考试的分数排名
    this.ranks = {}

    // 根据题目排名
    this.quest_ranks = {}
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

    /**
     * 给submits计算分数
     */
    submits.forEach( submit => {
      const conf = this.conf[submit.exam]
      const {scores} = conf
      const {ref_time, min_score, weight} = scores[submit.question]
      submit.score = this.score(submit.exe_time, ref_time, min_score, submit.status === 2, weight)
    })



    if(this.max_id) { // 计算增量

    } else { // 计算全量

      const groups_by_student_question = R.groupBy(submit => {
        return submit.student_id + '
      })

      const groups_by_exam = R.groupBy(submit => {
        return submit.exam
      })(submits)

      Object.keys(groups_by_exam).map(key => {
        const list = groups_by_exam[key]

        const groups_by_student = R.groupBy(submit => {
          return submit.student_id
        })(list)

        const maxHeap = new MaxHeap(
          (a, key) => a.score = key,
          a => a.score
        )

        Object.keys(groups_by_student).map(student_id => {
          const student_submits = groups_by_student[student_id]
          const groups_by_question = R.groupBy(submit => submit.question)(student_submits)

          let total = 0
          let anySubmit = null
          Object.keys(groups_by_question).map(question => {
            const max_submit = R.reduce(R.maxBy(x => x.score), 0, groups_by_question[question])
            total += max_submit.score
            if(!anySubmit) anySubmit  max_submit
          })

          maxHeap.add({
            email : anySubmit.email,
            name : anySubmit.nickname,
            score : total
          })
        })
        this.ranks[key] = maxHeap
      })

    }

  }

}

module.exports = Rank