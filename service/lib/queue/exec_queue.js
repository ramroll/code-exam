const redis = require('redis')

let client = null
class ExecQueue{

  constructor(){

    if (!client) {
      client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        no_ready_check: true
      })
    }

  }

  enqueue(submit_id) {
    client.rpush('submit', submit_id)
  }

  async dequeue(){
    return new Promise((resolve, reject) => {
      client.lpop('submit', function(err, res) {
        if(err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }
}

module.exports = ExecQueue