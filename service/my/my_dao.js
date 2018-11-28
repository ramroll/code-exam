const Db = require('../lib/db/db')
const fs = require('fs')
const path = require('path')
const LogicException = require('../lib/exception/LogicException')

class School {

  constructor(){
    this.db = new Db()
  }


  async classes(account_id){
    const sql = `select A.status, B.id, B.name as class_name
      from class_student A
      left join class B
      on A.class_id = B.id
      left join student C
      on A.account_id = C.account_id
      where A.account_id=${account_id}`

    const list = await this.db.query(sql)

    const class_ids = list.map(x => x.id)
    if(class_ids.length > 0) {

      const count = await this.db.query(`select class_id, count(*) as c from class_student where class_id in (${class_ids.join(',')}) group by class_id`)
      list.forEach(item => {
        item.total = count.find(x => x.class_id === item.id).c
      })
    }
    return list
  }



}


module.exports = School