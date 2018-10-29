
const Db = require('../../db/db')
class Account{

  register(account){
    const db = new Db()
    return db.insert('account', account)
  }

  send_email() {
  }
}