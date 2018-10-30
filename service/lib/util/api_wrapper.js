const LogicException = require('../exception/LogicException')
function api_wrapper(func){

  return async (req, res) => {
    try{
      await func(req, res)
    } catch(ex) {

      console.error(ex)
      if(ex instanceof LogicException) {
        res.status(400).send({
          error : ex.message
        })
        return
      }
      res.status(500).send({
        error : 'Internal Server Error'
      })
    }
  }
}

module.exports = api_wrapper