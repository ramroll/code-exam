class ConnectionException extends Error {
  constructor(err){
    super(err.message)
  }
}

module.exports = ConnectionException


