const DB_CONFIG = {
  "DB_HOST": process.env.DB_HOST || 'localhost',
  "DB_PORT": process.env.DB_PORT || '3306',
  "DB_PASSWD": process.env.DB_PASSWD || "AB123456",
  "DB_USER": process.env.DB_USER || "root",
  "DB_NAME": process.env.DB_NAME || "codeexam"
}
const path = require('path')
const configure = {
  apps: [{
    name: "account",
    // node ./scripts/server/runner.js -s account -p 8001
    script: "./scripts/server/runner.js",
    args: "-s account -p 8001",
    watch: true,
    env: {
      ...DB_CONFIG,
      "NODE_ENV": process.env.NODE_ENV,
      "EMAIL_PASSWD": "XQe3s2piwR0R"
    }
  }, {
    name: "exam",
    script: "./scripts/server/runner.js",
    args: "-s exam -p 8002",
    watch: true,
    env: {
      ...DB_CONFIG,
      "NODE_ENV": process.env.NODE_ENV,
      'EXAM_DIR': process.env.EXAM_DIR || path.resolve(__dirname, 'exams'),
    }
  },{
    name: "rank",
    script: "./scripts/server/runner.js",
    args: "-s rank -p 8004",
    watch: true,
    env: {
      ...DB_CONFIG,
      "NODE_ENV": process.env.NODE_ENV,
      'EXAM_DIR': process.env.EXAM_DIR || path.resolve(__dirname, 'exams')
    }
  },{
    name : "executor",
    script : './service/executor/index.js',
    env : {
      ...DB_CONFIG,
      'EXAM_DIR': process.env.EXAM_DIR || path.resolve(__dirname, 'exams')
    }
  }]
}

if(process.env.NODE_ENV === 'production') {
  configure.apps.push({
    name: "server",
    script: "./scripts/server/runner.js",
    args: "-s server -p 8003"
  })
}
else {
  configure.apps.push({
    name : 'exam-webpack',
    script: "./node_modules/.bin/webpack-dev-server",
    args : "--config ./app/exam/webpack.config.js",
    env : {
      NODE_ENV : process.env.NODE_ENV,
      APP : 'exam',
      PORT : 8000
    }
  })
  configure.apps.push({
    name : 'inspire-webpack',
    script: "./node_modules/.bin/webpack-dev-server",
    args : "--config ./app/inspire/webpack.config.js",
    env : {
      NODE_ENV : process.env.NODE_ENV,
      APP : 'inspire',
      PORT : 8009
    }
  })
}

module.exports = configure
