const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const LogicException = require('../../lib/exception/LogicException')
class Inspire{

  constructor(){
    this.db = new Db()
  }

  /**
   * 试题列表
   */
  questions(account_id, offset, limit) {
    const sql = `select * from question where account_id=${account_id} and offset=${offset} and limit=${limit}`
    return this.db.query(sql)
  }

  /**
   * 创建/编辑试题
   */
  put_question(query) {
    if(query.id) {
      return this.db.update('question', query)
    } else {
      return this.db.insert('question', query)
    }
  }

  /**
   * 删除试题
   */
  delete_question(id) {
    return this.db.delete('question', id)
  }


  /**
   * 读取考试
   */
  exams(account_id, offset, limit) {
    const sql = `select * from exam where account_id=${account_id} and offset=${offset} and limit=${limit}`
    return this.db.query(sql)
  }

  /**
   * 增加修改考试
   * @param {*} query
   */
  put_exam(query) {
    if(query.id) {
      return this.db.update('exam', query)
    } else {

    }

  }

  /**
   * 增加/修改考试关联的题目
   */
  put_question_to_exam(query) {
    return this.db.update('exam_question', query)
  }



}

module.exports = Inspire