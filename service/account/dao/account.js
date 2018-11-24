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
        name: account.name,
        nickname : account.nickname,
        email : account.email
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
  }

  update(info, student_id) {
    info.id = student_id
    console.log(info)
    return this.db.update('student', info)
  }

  async login(verify, token_code) {
    const sql = `select * from account where email=?`
    const account = await this.db.queryOne(sql, [verify.email])
    if (!account) {
      throw new LogicException('用户不存在')
    }

    if(account.status !== 1) {
      throw new LogicException('请先激活')
    }

    const verify_pass = md5(verify.password + account.salt) === account.password
    if (!verify_pass) {
      throw new LogicException('用户名或密码错误')
    }

    const token = await this.db.queryOne(`select * from token where code=?`, [token_code])
    await this.db.update('token', {id : token.id, account_id : account.id})
  }

  async get_token(code) {

    const sql = `select * from token where code=? order by id desc`
    const token = await this.db.queryOne(sql, [code])

    if(!token) {
      console.log('token not found', code)
      return {}
    }

    const now = new Date().getTime()
    const created = new Date(token.created).getTime()

    console.log('token diff', now - created, now, created)
    if(now - created > 3600 * 24 * 3 * 1000) { // 保留3天
    // if(now - created > 1) { // 保留3天
      console.log('token renew')
      return {}
    }

    const sql_user = `select A.id as student_id, A.nickname, A.email, B.id as account_id,A.name, B.status, A.avatar, A.intro from student as A
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