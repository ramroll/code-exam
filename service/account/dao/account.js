const Db = require('../../lib/db/db')
const md5 = require('md5')
const { send, TPL_REG, TPL_FORGET } = require('./send_email')
const LogicException = require('../../lib/exception/LogicException')
class Account {

  constructor(){
    this.db = new Db()
  }

  async register(account) {
    const password = account.password
    let salt = ''
    for(let i = 0 ; i < 6; i++) {
      salt += rint(10)
    }
    const accountObj = {
      password : md5(password + salt),
      salt,
      email : account.email,
    }


    const connection = await this.db.getConnection()

    try {
      await this.db.beginTransaction(connection)
      const id = await this.db.insert('account', accountObj)
      const studentObj = {
        account_id: id,
        name: account.name
      }
      await this.db.insert('student', studentObj)
      await this.create_vcode(id)
      await this.db.commitTransation(connection)

    }catch(ex) {
      await this.db.rollback(connection)
      if(ex.code === 'ER_DUP_ENTRY') {
        throw new LogicException('邮箱已注册')
      }
      throw ex
    }
  }

  async login(verify) {
    const sql = `select * from account where name=?`
    const account = await this.db.queryOne(sql, [verify.name])
    if (!account) {
      throw new LogicException('用户不存在')
    }

    const verify_pass = md5(account.passwd + account.salt)
    if (verify_pass) {
      return true
    }
    throw new LogicException('用户名或密码错误')

    const sql1 = `select * from student where account_id=${account.id}`
    const student = await this.db.queryOne(sql1)

    return {

    }
  }

  async get_token(code) {

    const sql = `select * from token where code=? order by id desc`
    const token = await this.db.queryOne(sql, [code])

    if(!token) {
      console.log('token not found')
      return {}
    }

    const now = new Date().getTime()
    const created = new Date(token.created).getTime()

    if(now - created > 3600 * 24 * 3) { // 保留3天
    // if(now - created > 1) { // 保留3天
      console.log('token renew')
      return {}
    }

    const sql_user = `select A.id,A.name from student as A
      left join account as B
      on A.account_id = B.id
      where B.id = ${token.account_id}
    `

    const student = await this.db.queryOne(sql_user)
    return {student,token}
  }

  async create_token() {
    const code = md5(Math.random())
    const token = {
      code
    }
    await this.db.insert('token', token)
    return code
  }

  create_vcode(id) {
    return this.db.insert('vcode', {
      code: (rint(9) + 1) + ''.padStart(20, '' + rint(1000000000000000)),
      account_id : id,
      type: 'send-email'
    })
  }

  send_email() {

  }
}

function rint(n) {
  return Math.floor(Math.random() * n)
}

module.exports = Account