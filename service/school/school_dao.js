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
        x.priv = 'manager'
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

  async my_class(id, account_id) {
    const sql = `select * from class where id=${id}`
    const myClass = await this.db.queryOne(sql)

    if(!myClass) {
      throw new LogicException('班级不存在')
    }

    const sql2 = `select A.id, email from class_admin A
      left join account B
      on A.account_id = B.id
      where class_id=${myClass.id}
    `
    const managers = await this.db.query(sql2)
    myClass.managers = managers
    return myClass
  }

  /**
   * 获取我申请的班级
   * @param {*} id
   * @param {*} account_id
   */
  async my_class_apply(id, account_id) {
    const sql = `select * from class where id=${id}`
    const myClass = await this.db.queryOne(sql)

    if(!myClass) {
      throw new LogicException('班级不存在')
    }

    const sql2 = `select * from class_student
      where account_id=${account_id} and class_id=${myClass.id}
    `

    const apply = await this.db.queryOne(sql2)
    myClass.apply = apply
    return myClass
  }

  async apply_class(id, account_id) {
    const sql = `select * from class where id=${id}`
    const myClass = await this.db.queryOne(sql)

    if(!myClass) {
      throw new LogicException('班级不存在')
    }


    const sql2 = `select * from class_student
      where account_id=${account_id} and class_id=${myClass.id}
    `
    const apply = await this.db.queryOne(sql2)
    if(apply) {
      throw new LogicException('您已经选过这门课')
    }

    await this.db.insert('class_student', {
      class_id : myClass.id,
      account_id,
      status : 'apply'
    })

  }

  async delete_class(id, account_id) {
    const myClass = await this.db.queryOne(`select id, account_id from class where id=${id}`)
    if(!myClass) {

      throw new LogicException('班级不存在')
    }
    if(myClass.account_id !== account_id) {
      throw new LogicException('权限不足')
    }

    await this.db.delete('class', id)
    await this.db.query(`delete from class_admin where class_id=${id}`)
  }


  /**
   * 创建和修改班级
   * @param {*} obj
   */
  async put_class(obj, account_id) {
    const connection = await this.db.getConnection()

    try{

      let class_id = null

      await this.db.beginTransaction(connection)
      const { id, name, intro, managers } = obj
      if (obj.id) {
        const myClass = await this.db.queryOne(`select id, account_id from class where id=${id}`, {}, connection)
        class_id = myClass.id
        if (!myClass) {
          throw new LogicException('班级不存在')
        }
        if (myClass.account_id !== account_id) {
          throw new LogicException('权限不足')
        }

        await this.db.update('class', {
          id,
          name,
          intro
        }, connection)

      } else {
        obj.account_id = account_id
        class_id = await this.db.insert('class', {
          name,
          intro,
          account_id

        }, connection)
      }

      for(let i = 0; i < managers.length; i++) {
        const manager = managers[i]
        const {email} = manager
        const account = await this.db.queryOne(`select id from account where email='${email}'`, {}, connection)
        if(!account) {
          throw new LogicException('用户' + email + '不存在')
        }

        if(account.id === account_id) {
          throw new LogicException('不能添加自己为管理员(您已经是超级管理员)')
        }

        await this.db.query(`delete from class_admin where account_id=${account_id} and class_id=${class_id}`,{}, connection)
        await this.db.insert('class_admin', {
          account_id : account.id,
          class_id : class_id
        }, connection)
      }

      await this.db.commitTransation(connection)
    }
    catch (ex) {
      await this.db.rollback(connection)
      throw ex
    }
    finally {
      connection.release()
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

    if (!student) {
      throw new LogicException('学员不存在(或没有选课）')
    }

    if (student.status === status) {
      throw new LogicException('不能重复设置状态')
    }


    const myClass = await this.db.queryOne(`select id, account_id from class where id=${student.class_id}`)
    const others = await this.db.query(`select id, account_id from class_admin where class_id=${student.class_id}`)


    /* 验证权限 */
    if (myClass.account_id !== account_id) {
      const o = others.find(x => x.account_id === account_id)
      if (!o) {
        throw new LogicException('权限不足')
      }
    }

    this.db.update('class_student', {
      id: id,
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

  async my_student(account_id, offset, limit) {
    const mine = await this.db.query(`select id from class where account_id = ${account_id}`)
    const others = await this.db.query(
      `select class_id as id from class_admin where account_id=${account_id}`
    )

    const ids = [...mine.map(x => x.id), ...others.map(x => x.id)]

    if(ids.length === 0) {return []}

    const list = await this.db.query(
      `select A.id, B.name,B.email, B.avatar, A.status from class_student A
       left join student B
       on B.account_id = A.account_id
       where A.class_id in (${ids.join(',')})`
    )

    return list



  }


}


module.exports = School