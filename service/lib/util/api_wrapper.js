const LogicException = require('../exception/LogicException')
const LoginException = require('../exception/LoginException')
const ConnectionException = require('../exception/ConnectionException')
function api_wrapper(func){

  return async (req, res) => {
    try{
      await func(req, res)
    } catch(ex) {

      if(ex instanceof LogicException) {
        res.status(400).send({
          error : ex.message
        })
        return
      }

      if(ex instanceof LoginException) {
        res.status(401).send({
          error : "尚未登录"
        })
        return
      }

      if(ex instanceof ConnectionException) {
        res.status(400).send({
          error : '网络忙，请稍后再试'
        })
        return 
      }

      console.error(ex)
      res.status(500).send({
        error : 'Internal Server Error'
      })
    }
  }
}

module.exports = api_wrapper