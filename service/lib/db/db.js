const mysql = require('mysql')
const sqlFormatter = require('sql-formatter')

function get_connection(){
  console.log(process.env)
  return mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    port: 3306,
    database: process.env.DB_NAME
  })
}


class Db{
  constructor(){
    if(!Db.pool) {
      Db.pool = get_connection()
    }
  }

  insert(tbl, data) {
    const sql = `insert into ${tbl} set ?`
    return this.query(sql, data)
  }

  update(tbl, data) {
    const {id, ...others} = data
    if(!id) {
      throw '需要ID'
    }

    const flds = Object.keys(others)
      .filter( fld => {
        return typeof others[fld] !== 'undefined' &&
          others[fld] !== null
      })

    const sql = `update ${tbl}
      SET ${flds.map(fld => `\`${fld}=?`).join(',')}
      where id=?
    `

    const fldValues = flds.map(fld => data[fld])
    fldValues.push(id)
    return this.query(sql, fldValues)
  }

  delete(tbl, id) {
    const sql = `delete from ${tbl} where id = ${id}`
    return this.query(sql)
  }

  async queryById(tbl, id) {
    const sql = `select * from ${tbl} where id=?`
    const list = this.query(sql, [id])
    if(list.length > 0)  {
      return list[0]
    }
    return null
  }

  async queryOne(sql, params) {
    const list = this.query(sql, params)
    if(list.length > 0) {return list[0]}
    return null
  }



  query(sql, params){
    return new Promise( (resolve, reject) => {

      Db.pool.getConnection(function (err, connection) {
        if(err) {
          throw err
        }
        connection.query(sql, params, (error, results, fields) => {
          connection.release()
          if (error) {
            console.log(sqlFormatter.format(sql))
            reject(error)
          }
          resolve(results)
        })
      })
    })
  }}

module.exports = Db