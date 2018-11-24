const Db = require('../lib/db/db')
const fs = require('fs')
const path = require('path')
const LogicException = require('../lib/exception/LogicException')

class School {

  constructor(){
    this.db = new Db()
  }


  /**
   * 获取我有权限管理的班级
   */
  async my_classes(account_id, offset, limit) {

    const proxy = await this.db.query(`select class_id from class_admin where account_id=${account_id}`)

    let related = [] 
    if(proxy.length > 0) {
      const ids = proxy.map(x => x.class_id)
      related = await this.db.query(`select * from class where id in (${ids.join(',')})`)
      related = related.map(x => {
        x.prev = 'manager'
        return x
      })
    }
    let mine = await this.db.query(`select * from class where account_id=${account_id} limit ${limit} offset ${offset}`)

    mine = mine.map(x => {
      x.priv = 'super'
      return x
    })


    return [...mine, ...related]
  }

  async delete_class(id, account_id) {
    const myClass = await this.db.queryOne(`select id, account_id from class where id=${id}`)
    if(myClass.id !== account_id) {
      throw new LogicException('权限不足')
    }

    return this.db.delete('class', id)
  }


  /**
   * 创建和修改班级 
   * @param {*} obj 
   */
  async put_class(obj, account_id) {
    if(obj.id) {
      const myClass = await this.db.queryOne(`select id, account_id from class where id=${id}`)
      if(!myClass) {
        throw new LogicException('班级不存在')
      }
      if(myClass.account_id !== account_id) {
        throw new LogicException('权限不足')
      }
      return this.db.update('class', obj)
    } else {
      obj.account_id = account_id
      return this.db.insert('class', obj)
    }
  }


  /**
   * 班级中的学生
   */
  async get_class_students(account_id, class_id, status, offset, limit) {
    const myClass = await this.db.queryOne(`select id, account_id from class where id=${class_id}`)
    if(myClass.account_id !== account_id) {
      throw new LogicException('权限不足')
    }
    const sql = `select * from class_student where class_id=?
      and status=?
      order by id desc
      offset ? 
      limit ? 
    `

    return this.db.query(sql, [
      class_id,
      status,
      offset,
      limit
    ])
  }

  async change_student_status(id, account_id, status) {

    const student = await this.db.queryOne(`select * from class_student 
      where id=${id}`)
    

    if(!student) {
      throw new LogicException('学员不存在(或没有选课）')
    }



    if(student.status === status) {
      throw new LogicException('不能重复设置状态')
    }

    const myClass = await this.db.queryOne(`select id, account_id from class where id=${student.class_id}`)
    if(myClass.account_id !== account_id) {
      throw new LogicException('权限不足')
    }

    this.update('class_student', {
      id : id,
      status,
    })
  }

  async delete(id, account_id) {

    const student = await this.db.queryOne(`select * from class_student 
      where id=${id}`)

    if(!student) {
      throw new LogicException('学员不存在')
    }

    const myClass = await this.db.queryOne(`select id, account_id from class where id=${student.class_id}`)
    if(myClass.account_id !== account_id) {
      throw new LogicException('权限不足')
    }

    return await this.db.delete('class_student', id)
    
  }


}


module.exports = School