## coding考试系统

### 目录结构
```
├── app
│   ├── exam 考试系统前端
│   └── lib  通用工具
├── dist -- 静态资源上线发布
│   └── exam
├── quest -- 任务清单(给开发者)
├── exams 测试试卷
│   └── test
│── sql 数据库维护
├── scripts 脚本和工具
│   ├── server 服务相关脚本
└── service 服务
    ├── account 账户服务
    ├── exam 考试服务
    ├── executor 执行器和验证器
    ├── lib 公用库
    └── server web服务
    └── rank 排名服务
```


### 依赖

nomnon - 命令行参数处理

pm2 - 进程管理

mysql - mysql连接

sql-formatter - sql语句格式化（美观)

nodemailer - 发送邮件

md5 - 签名

ramda - 数值操作

react,react-dom - react

codemirror - 代码编辑器

stylus - css预编译

markdown-it - mardown 解析

antd - 表单组件库(注册、登录）

antd - 组件库

classnames - 类名解析






### 启动需要配置的环境变量

- EMAIL_PASSED 邮箱密码
- DB_HOST 数据库HOST
- DB_USER 数据用户
- DB_PASSWD 数据库密码
- DB_NAME 数据库名称


### 开发配置


# 安装依赖
yarn

# 生成建表语句
node service/lib/db/createdb.js

# 安装 mysql 然后创建数据库

> 注意端口不要和本地已有的 mysql 重复

1. [docker 安装](http://www.runoob.com/docker/ubuntu-docker-install.html)

2. [docker 改源](https://www.jianshu.com/p/34d3b4568059)

3. 下载 mysql 镜像

```
docker pull mysql:5.7(开发使用 5.7,8 有点坑)
```

4.  制作镜像

    - 可以根据建表语句自动创建表，保证数据统一

    * **数据的备份和恢复 暂时做不到，关机数据库数据可能会丢失**

    - 进入 sql 目录，执行命令

```
    docker image build -t code_exam_db .
```

5.  启动 mysql 容器

```
    docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=以上数据库密码 --name=db1 code_exam_db
```

# /etc/hosts
127.0.0.1 www.weavinghorse.test 

# 开发nginx配置
server {
  server_name www.weavinghorse.test;
  listen 80;

  location / {
    proxy_pass http://localhost:8000;
  }

  location /api/account/ {
    proxy_pass http://localhost:8001/;
  }

  location /api/exam/ {
    proxy_pass http://localhost:8002/;
  }

  location /api/rank/ {
    proxy_pass http://localhost:8004/;
  }

}

# 执行
# 执行4个服务
pm2 start process.config.js

# 程序验证器开启
# sh ./run_executor.sh

# web端
npm start
