const mysql = require('mysql')

function get_connection(){
    return mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port : 3306
    })
}


class Db{
  constructor(){
    if(!Db.pool) {
      Db.pool = get_connection()
    }
  }

  insert(tbl, data) {
    const flds = Object.keys(data)
      .filter( fld => {
        return typeof data[fld] !== 'undefined' &&
          data[fld] !== null
      })

    const sql = `insert into ${tbl}
      (${flds.map(x => '`' + x + '`').join(',')}) values (
        ${flds.map(x => `'${data[x]}'`).join(',')}
      )
    `
    console.log(sql)
    return this.query(sql)
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
      SET ${flds.map(fld => `\`${fld}\`='${others[fld]}'`)}
      where id=${id}
    `

    return this.query(sql)

  }

  delete(tbl, id) {
    const sql = `delete from ${tbl} where id = ${id}`
    return this.query(sql)
  }

  query(sql){
    return new Promise( (resolve, reject) => {

      Db.pool.getConnection(function (err, connection) {
        connection.query(sql, (error, results, fields) => {
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