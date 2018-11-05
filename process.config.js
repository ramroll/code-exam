const DB_CONFIG = {
  DB_HOST: "localhost",
  DB_PORT: 3306,
  DB_PASSWD: "123qweasd",
  DB_USER: "root",
  DB_NAME: "codeexam"
};

module.exports = {
  apps: [
    {
      name: "account",
      // node ./scripts/server/runner.js -s account -p 8001
      script: "./scripts/server/runner.js",
      args: "-s account -p 8001",
      watch: true,
      env: {
        ...DB_CONFIG,
        NODE_ENV: "development",
        EMAIL_PASSWD: "XQe3s2piwR0R"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "exam",
      script: "./scripts/server/runner.js",
      args: "-s exam -p 8002",
      watch: true,
      env: {
        ...DB_CONFIG,
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "rank",
      script: "./scripts/server/runner.js",
      args: "-s rank -p 8004",
      watch: true,
      env: {
        ...DB_CONFIG,
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "server",
      script: "./scripts/server/runner.js",
      args: "-s server -p 8003"
    }
  ]
};
