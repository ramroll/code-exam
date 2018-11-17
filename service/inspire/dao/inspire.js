const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const LogicException = require('../../lib/exception/LogicException')
class Inspire{

  constructor(){
    this.db = new Db()
    this.put_paper = this.put_paper.bind(this)
  }

  /**
   * 试题列表
   */
  questions(account_id, offset, limit) {
    const sql = `select * from question where account_id=${account_id} limit ${limit} offset ${offset} `
    return this.db.query(sql)
  }

  question(id) {
    const sql = `select * from question where id=${id} `
    return this.db.queryOne(sql)
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
  async delete_question(id) {
    const sql = `select * from question_exam where question_id=${id}`
    const question = await this.db.queryOne(sql)
    if(question) {
      throw new LogicException('这道题目已经在其他试卷中使用')
    }
    return this.db.delete('question', id)
  }


  /**
   * 读取考试
   */
  exams(account_id, offset, limit) {
    const sql = `select * from exam where account_id=${account_id} limit ${limit} offset ${offset}`
    return this.db.query(sql)
  }
  /**
   * 考试是否存在 
   */
  exists_exam(name) {

    const sql = `select id from exam where name='${name}'`
    return this.db.queryOne(sql)
  }

  /**
   * 增加修改考试
   * @param {*} query
   */
  async put_paper(query, account_id) {
    const {list, ...others} = query


    others.account_id = account_id
    const connection = await this.db.getConnection()

    try{
      await this.db.beginTransaction(connection)

      let id = others.id
      if (others.id) {
        await this.db.update('exam',others, connection)
        const ids = list.map(x => x.id).filter(x => x)
        if(ids.length > 0) {
          const sql = `delete from exam_question where id in (${ids.join(',')})`
          await this.db.query(sql, null, connection)
        }
      } else {
        id = await this.db.insert('exam',others, connection)
      }

      let total = 0
      for (let i = 0; i < list.length; i++) {
        const question_exam = list[i]
        question_exam.exam_id = id
        await this.db.insert('exam_question', question_exam, connection)
        total ++
      }
      if(total === 0) {
        throw new LogicException('至少要提1个问题')
      }

      await this.db.commitTransation(connection)
      connection.release()
    } catch(ex) {
      await this.db.rollback(connection)
      connection.release()
      throw ex
    }


  }

  /**
   * 增加/修改考试关联的题目
   */
  put_question_to_exam(query) {
    return this.db.update('exam_question', query)
  }


  /**
   * 获取试卷
   */
  async paper(id){

    const sql = `select * from exam where id=${id}` 
    const paper = await this.db.queryOne(sql)
    if(!paper) {
      throw new LogicException('试卷不存在')
    }
    const sql2 = `select * from exam_question where exam_id=${paper.id}`
    const list = await this.db.query(sql2)
    paper.list = list
    return paper

  }

  /**
   * 删除试卷
   */
  async delete_paper(id) {
    await this.db.query(`delete from exam_question where exam_id=${id}`)
    await this.db.delete('exam', id)
  }

}

module.exports = Inspire