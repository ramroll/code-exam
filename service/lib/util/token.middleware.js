const Db = require('../db/db')
const Account = require('../../account/dao/account')
const ConnectionException = require('../exception/ConnectionException')
const token_middleware = async function(req, res, next) {
  const code = req.headers.token
  try{
    const account = new Account()
    const {token, student} = await account.get_token(code)

    if(!token) {
      const code = await account.create_token()
      res.set('TOKEN', code)
      req.headers.token = code
    } else {
      res.set('TOKEN', token.code)
    }
    req.student = student
    next()
  } catch(ex) {
    // if(ex === 'not-activation') {
    //   res.status(403).send({error : '没有激活'})
    //   return
    // }
    if(ex instanceof ConnectionException) {
      res.status(400).send({error : '网络忙，请稍后再试!'})
      return
    }
    console.error(ex)
    res.status(500).send('Internal server error')
  }
}

module.exports = token_middleware