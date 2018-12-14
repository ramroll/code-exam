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

  async updateQuestionRank(){
    const exam_names = ( await this.db.query(`select distinct(exam) from submit`) ).map(x => x.exam)
    this.conf = await this.loadExamConfs()

    const sql = `
      select A.id, A.exam, A.code, A.student_id, A.status, A.question, A.exe_time,B.email, B.nickname
      from submit A
      left join student B
      on A.student_id = B.id
      where status>=2 and A.id > ${this.max_id}
      order by id desc
    `
    const submits = await this.db.query(sql)
    if(submits.length > 0) {
      this.max_id = submits[0].id
    }

    /**
     * 给submits计算分数
     */
    submits.forEach( submit => {
      const conf = this.conf[submit.exam]
      const {scores} = conf
      const {ref_time, min_score, weight} = scores[submit.question]
      submit.score = this.score(submit.exe_time, ref_time, min_score, submit.status === 2, weight)
    })


    const group_by_questions = R.groupBy(submit => {
      return submit.exam + '-' + submit.question
    })(submits)

    group_by_questions.forEach(key => {
      const submitsForQuestion = group_by_questions[key]

      // 根据用户分组计算最高分
      const group_by_users = R.groupBy(submit => {
        return submit.student_id
      })(submitsForQuestion)

      group_by_users.forEach(key => {
        const userSubmits = group_by_users[key]

        /* 对某个用户的最高分提交 */
        const maxSubmit = R.reduce(R.maxBy(x=>x.score), 0, userSubmits)
        if(!this.quest_ranks[key]) {
          this.quest_ranks[key] = new MaxHeap(
            (x, key) => x.score = key,
            x => x.score,
            x => x.question + '--' + x.student_id
          )
        }

        // 处理全量和增量的关系
        if(!this.quest_ranks[key].contains(userSubmits)) {
          this.quest_ranks[key].add(maxSubmit)
        } else {
          const item = this.quest_ranks[key].getHeapItem(maxSubmit)
          if(item.score < maxSubmit.score) {
            this.quest_ranks[key].increse(maxSubmit)
          }
        }
      })
    })

  }

  async buildRank() {
    await this.updateQuestionRank()
    this.conf = await this.loadExamConfs()
  }

  getQuestions(name, question_id, offset, limit){
    const submits = this.quest_ranks[name + '-' + question_id]
      .getSorted()
    return submits
  }

  getExam(name) {

    const conf = this.conf[exam]
    const users = {}
    const questions = Object.keys(conf.scores).forEach(question_id => {
      const submits = this.quest_ranks[name + '-' + question_id]
        .getSorted()

      submits.forEach(submit => {
        if(!users[submit.student_id]) {
          users[submit.student_id] = {
            email : submit.email,
            avatar : submit.avatar,
            total : 0
          }
        }
        users[submit.student_id].total += submit.score
      })
    })

    return users
  }
}

module.exports = Rank