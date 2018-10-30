module.exports = {
  apps : [{
    name        : "account",
    script      : "./scripts/server/runner.js",
    args        : "-s account -p 8001",
    watch       : true,
    env: {
      "DB_HOST" : 'localhost',
      "DB_PORT" : '3306',
      "DB_PASSWD" : "123456",
      "DB_USER" : "root",
      "DB_NAME" : "codeexam",
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  }, {
    name        : "exam",
    script      : "./scripts/server/runner.js",
    args        : "-s exam -p 8002",
    watch       : true,
    env: {
      "DB_HOST" : 'localhost',
      "DB_PORT" : '3306',
      "DB_PASSWD" : "123456",
      "DB_USER" : "root",
      "DB_NAME" : "codeexam",
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  }]
}