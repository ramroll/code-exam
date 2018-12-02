const DB_CONFIG = {
  "DB_HOST": process.env.DB_HOST || 'localhost',
  "DB_PORT": process.env.DB_PORT || '3306',
  "DB_PASSWD": process.env.DB_PASSWD || "cxf",
  "DB_USER": process.env.DB_USER || "root",
  "DB_NAME": process.env.DB_NAME || "codeexam"
}

const AVATAR_URL = process.env.AVATAR_URL || '/avatar'
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
      "EMAIL_PASSWD": "cxf123"
    }
  }, {
    name: "school",
    // node ./scripts/server/runner.js -s account -p 8001
    script: "./scripts/server/runner.js",
    args: "-s school -p 8012",
    watch: true,
    env: {
      ...DB_CONFIG,
      "NODE_ENV": process.env.NODE_ENV,
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
  }, {
    name: "inspire",
    script: "./scripts/server/runner.js",
    args: "-s inspire -p 8010",
    watch: true,
    env: {
      ...DB_CONFIG,
      AVATAR_URL,
      "NODE_ENV": process.env.NODE_ENV
    }
  }, {
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
    name: "my",
    script: "./scripts/server/runner.js",
    args: "-s my -p 8014",
    watch: true,
    env: {
      ...DB_CONFIG,
      "NODE_ENV": process.env.NODE_ENV
    }
  }, {
    name: "executor",
    script: './service/executor/index.js',
    env: {
      ...DB_CONFIG,
      'EXAM_DIR': process.env.EXAM_DIR || path.resolve(__dirname, 'exams')
    }
  }]
}

if (process.env.NODE_ENV === 'production') {
  configure.apps.push({
    name: "server",
    script: "./scripts/server/runner.js",
    args: "-s server -p 8003"

  })
}
else {
  configure.apps.push({
    name: 'exam-webpack',
    script: "./node_modules/.bin/webpack-dev-server",
    args: "--config ./app/exam/webpack.config.js",
    env: {
      AVATAR_URL,
      NODE_ENV: process.env.NODE_ENV,
      APP: 'exam',
      PORT: 8000
    }
  })
  configure.apps.push({
    name: 'my-webpack',
    script: "./node_modules/.bin/webpack-dev-server",
    args: "--config ./app/my/webpack.config.js",
    env: {
      AVATAR_URL,
      NODE_ENV: process.env.NODE_ENV,
      APP: 'my',
      PORT: 8013
    }
  })
  configure.apps.push({
    name: 'account-webpack',
    script: "./node_modules/.bin/webpack-dev-server",
    args: "--config ./app/account/webpack.config.js",
    env: {
      AVATAR_URL,
      NODE_ENV: process.env.NODE_ENV,
      APP: 'account',
      PORT: 8011
    }
  })
  configure.apps.push({
    name: 'inspire-webpack',
    script: "./node_modules/.bin/webpack-dev-server",
    args: "--config ./app/inspire/webpack.config.js",
    env: {
      AVATAR_URL,
      NODE_ENV: process.env.NODE_ENV,
      APP: 'inspire',
      PORT: 8009
    }
  })
}

module.exports = configure
