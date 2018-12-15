const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const LogicException = require('../../lib/exception/LogicException')
class Comment{

  constructor(){
    this.db = new Db()
  }

  async applaud(id, account_id) {

    const sql = `select * from submit_applaud where submit_id=${id} and account_id=${account_id}`
    const applaud = await this.db.queryOne(sql)
    if(applaud) {
      await this.db.update('submit_applaud', {
        id : applaud.id,
        update : new Date().getTime(),
        applaud : applaud.applaud ? 0 : 1 
      })

      return applaud.applaud ? -1 : 1 
    } else {
      await this.db.insert('submit_applaud', {
        submit_id : id,
        account_id,
        update : new Date().getTime(),
        applaud : 1
      })
      return 1 
    }
  }


}

module.exports = Comment