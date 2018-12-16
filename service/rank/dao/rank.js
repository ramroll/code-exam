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
    this.max_applaud_id = -1

    // 根据考试的分数排名
    this.ranks = {}
    this.rank_by_weight = {}

    // 根据题目排名
    this.quest_heaps = {}

    this.submit_applauds = {} 
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

    let addScore = 0
    if(diff > 0) {
      addScore += diff * 14 
    }

    let score = min_score + (addScore  / 2)
    weight = weight / 100
    // console.log('score', diff, refer_exe_time, real_exe_time, score)
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

    const sql = `
      select A.id, A.exam, A.code, A.student_id, A.status, A.question, A.exe_time,B.email, B.nickname,B.avatar
      from submit A
      left join student B
      on A.student_id = B.id
      where status=2 and A.id > ${this.max_id}
      order by id desc
    `
    let submits = await this.db.query(sql)
    if(submits.length > 0) {
      this.max_id = submits[0].id
    }

    /**
     * 给submits计算分数
     */
    submits = submits.map( submit => {
      const conf = this.conf[submit.exam]
      if(!conf) {return submit}
      const {scores} = conf
      const {ref_time, min_score, weight} = scores[submit.question]
      submit.score = this.score(submit.exe_time, ref_time, min_score, submit.status === 2, weight)
      return submit
    }).filter(x => x.score)

    const group_by_questions = R.groupBy(submit => {
      return submit.exam + '-' + submit.question
    })(submits)

    Object.keys(group_by_questions).forEach(k_exam_quest=> {
      const submitsForQuestion = group_by_questions[k_exam_quest]

      // 根据用户分组计算最高分
      const group_by_users = R.groupBy(submit => {
        return submit.student_id
      })(submitsForQuestion)

      Object.keys(group_by_users).forEach(key => {
        const userSubmits = group_by_users[key]

        /* 对某个用户的最高分提交 */
        const maxSubmit = userSubmits.reduce((max, submit) => {
          if(!max) {return submit}
          return max.score < submit.score ? max : submit
        }, null)


        if(!this.quest_heaps[k_exam_quest]) {
          this.quest_heaps[k_exam_quest] = new MaxHeap(
            (x, key) => x.score = key,
            x => x.score,
            x => x.question + '--' + x.student_id
          )
        }

        // 处理全量和增量的关系
        if(!this.quest_heaps[k_exam_quest].contains(maxSubmit)) {
          this.quest_heaps[k_exam_quest].add(maxSubmit)
        } else {
          const item = this.quest_heaps[k_exam_quest].getHeapItem(maxSubmit)
          if(item.score < maxSubmit.score) {
            this.quest_heaps[k_exam_quest].increase(maxSubmit, maxSubmit.score)
          }
        }
      })
    })


  }

  /**
   * 更新点赞
   */
  async updateApplaud() {
    const sql = `select * from submit_applaud where \`update\` > ${this.max_applaud_id} order by \`update\` desc`
    const applauds = await this.db.query(sql)
    if(applauds.length > 0) {
      this.max_applaud_id = applauds[0].update
    }
    applauds.forEach( ({submit_id, applaud}) => {
      if(!this.submit_applauds[submit_id]) {
        this.submit_applauds[submit_id] = applaud
        return
      }
      if(applaud) {
        this.submit_applauds[submit_id]++
      } else {
        this.submit_applauds[submit_id]--
      }
      
    })
  }

  async buildRank() {
    try {

      this.conf = await this.loadExamConfs()
      await this.updateApplaud()
      await this.updateQuestionRank()

      for (let key in this.quest_heaps) {
        this.ranks[key] = this.quest_heaps[key].getSorted()

        this.rank_by_weight[key] = [...this.ranks[key]]
          .sort((x, y) => {
            const ay = this.submit_applauds[y.id] || 0
            const ax = this.submit_applauds[x.id] || 0
            return (y.score - x.score) * 10 + (ay - ax) * 10
          })
      }

    }catch(ex) {
      console.error(ex)
    }
  }

  getQuestions(name, question_id, offset, limit){
    const key = name + '-' + question_id
    if(!this.rank_by_weight[key]) {
      return []
    }
    return this.rank_by_weight[key].slice(offset, offset + limit)
      .map(x => {
        x.applauds = this.submit_applauds[x.id] || 0
        return x
      })
  }

  getExam(name) {

    const conf = this.conf[name]
    const users = {}
    const questions = Object.keys(conf.scores).forEach(question_id => {
      const submits = this.ranks[name + '-' + question_id]
      if(!submits) {
        return
      }
      submits.forEach(submit => {
        if(!users[submit.student_id]) {
          users[submit.student_id] = {
            email : hide(submit.email),
            avatar : submit.avatar,
            name : submit.nickname,
            score : 0
          }
        }
        users[submit.student_id].score += submit.score
      })
    })

    return Object.keys(users).map(id => {
      return users[id]
    }).sort((x, y) => y.score - x.score)
  }
}

module.exports = Rank