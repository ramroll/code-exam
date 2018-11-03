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
  }

  /**
   * 对一次回答进行打分
   */
  score(real_exe_time, refer_exe_time, min_score, correct, weight){
    if(!correct) {return 0}
    weight = weight / 100
    const s = 100 * ( real_exe_time < refer_exe_time ? 1 : refer_exe_time / real_exe_time )
    const score = Math.max(s, min_score) * weight
    return score
  }


  /**
   * 给试卷进行排名和打分 
   * @param {*} name 
   */
  async buildRank(name){
    const maxHeap = new MaxHeap(
      (a, key) => a.score = key,
      a => a.score
    )
    const dir = path.resolve(__dirname, '../../../exams', name)
    if(!fs.existsSync(dir)) {
      throw new LogicException('试卷不存在')
    }
    const files = fs.readdirSync(dir)
    const count = files.filter(x => x.match(/\.md$/)).length
    const scores = require(path.resolve(dir, 'scores.config.js'))

    const sql = `
      select A.student_id, A.status, A.question, A.exe_time,B.email, B.nickname
      from submit A
      left join student B
      on A.student_id = B.id
      where exam=? and status>=2
    `
    const submits = await this.db.query(sql, [name])
    console.log(`${submits.length} submit found`)
    let users = {}

    // 计算所有学生的总分
    for(let i = 0; i < submits.length ; i++) {
      const {student_id, question , status, exe_time, nickname, email}= submits[i]
      // 初始化为0分
      if(!users[student_id]) {
        users[student_id] = {
          nickname,
          email : hide(email),
          scores : Array(count).fill(0),
          total : 0
        }
      }
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
    Object.keys(users).forEach(student_id => {
      const user = users[student_id]
      maxHeap.add({
        name : user.nickname,
        email : user.email,
        score : user.total
      })
    })
    return maxHeap
  }

}

module.exports = Rank 