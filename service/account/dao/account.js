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
      const code = await this.create_vcode(id)
      await this.db.commitTransation(connection)
      await send(account.email, '「算法训练」激活邮件', TPL_REG(code))

    }catch(ex) {
      await this.db.rollback(connection)
      if(ex.code === 'ER_DUP_ENTRY') {
        throw new LogicException('邮箱已注册')
      }
      throw ex
    }
  }

  async activation(code){


    const sql = `select * from vcode where code=? && status=0 order by id desc`
    const vcode = await this.db.queryOne(sql, [code])
    if(!vcode) {
      throw new LogicException('激活码不存在')
    }
    const now = new Date().getTime()
    const vcodetime = new Date(vcode.created).getTime()
    if(now - vcodetime > 3600 * 24 * 1000 * 7) {
      throw new LogicException('激活码已过期')
    }

    const account_id = vcode.account_id
    const account = await this.db.getById('account', account_id)
    if(!account) {
      throw new LogicException('账户不存在')
    }
    if(account.status === 1) {

      throw new LogicException('账户已激活')
    }

    await this.db.update('account', {status : 1, id : account_id})
    // this.db.update('vcode', {status : 1})
    // this.db.update('account', {status : 1})

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

    if(now - created > 3600 * 24 * 3 * 1000) { // 保留3天
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

  async create_vcode(id) {
    const code =  (rint(9) + 1) + ''.padStart(20, '' + rint(1000000000000000))
    await this.db.insert('vcode', {
      code,
      account_id : id,
      type: 'send-email'
    })
    return code
  }

  send_email() {

  }
}

function rint(n) {
  return Math.floor(Math.random() * n)
}

module.exports = Account