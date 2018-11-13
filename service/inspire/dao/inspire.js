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



}

module.exports = Inspire