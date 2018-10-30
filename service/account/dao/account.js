const Db = require('../../lib/db/db')
const md5 = require('md5')
const {send, TPL_REG, TPL_FORGET}= require('./send_email')
class Account{

  register(account){
    const db = new Db()
    return db.insert('account', account)
  }

  async login(verify) {
    const db = new Db()
    const sql = `select * from account where name=?`
    const account = await db.queryOne(sql, [verify.name])
    if(!account) {
      throw new LogicException('用户不存在')
    }

    const verify_pass = md5( account.passwd + account.salt )
    if(verify_pass) {
      return true
    }
    throw new LogicException('用户名或密码错误')

 }

  create_vcode(user_id){
    const db = new Db()
    const vcode = Math.random('')
    return db.insert('vcode', {
      code : (rint(9) + 1) + ''.padStart(20, '' + rint(1000000000000000)),
      user_id,
      type : 'send-email'
    })
  }

  send_email() {

  }
}

function rint(n){
  return Math.floor(Math.random() * n)
}

module.exports = Account