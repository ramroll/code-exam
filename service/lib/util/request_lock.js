const LogicException = require('../exception/LogicException')
let global_timeout = {}


/**
 * 定义一个和key相关的所，用于限制频繁提交
 * @param {*} key
 * @param {*} ms
 */
function request_lock(key, ms = 1000) {
  if(global_timeout[key]) {
    throw new LogicException('提交太频繁')
  }
  global_timeout[key] = true
  setTimeout( () => {
    global_timeout[key] = false
  }, ms)
}

module.exports = request_lock
