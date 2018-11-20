const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const LogicException = require('../../lib/exception/LogicException')
class Expain{

  constructor(){
    this.db = new Db()
  }

  async put_expain(query, account_id) {
    const exam = await this.db.queryOne(`select id from exam where name='${query.name}'`)
    if(!exam) {
      throw new LogicException('试卷不存在')
    }
    delete query.name
    query.exam_id = exam.id
    query.account_id = account_id
    if(query.id) {
      return this.db.update('exam_explain', query)
    } else {
      return this.db.insert('exam_explain', query)
    }
  }

  delete(id) {
    return this.db.delete('exam_explain', id)
  }
}

module.exports = Expain