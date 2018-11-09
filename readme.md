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

#### 安装依赖
```
yarn
```

#### 数据库安装和建表
```
# 安装mysql过程（略）

# 建表:按照 sql目录下文件字典顺序执行sql，比如先执行 0000001.sql
cat sql/000001.sql | mysql -uuser -p
```

#### HOST配置
127.0.0.1 www.weavinghorse.test

#### nginx配置
见[/scripts/nginx/www.weavinghorse.test.conf](nginx配置)

# 执行
# 执行4个服务
# 执行2个前端系统的dev-server
```
pm2 start process.config.js
```
