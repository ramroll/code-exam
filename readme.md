## coding考试系统

### 目录结构
```
├── app
│   ├── exam 考试系统前端
│   └── lib  通用工具
├── dist -- 静态资源上线发布
│   └── exam
├── exams 测试试卷
│   └── test
├── scripts 脚本和工具
│   ├── server 服务相关脚本
└── service 服务
    ├── account 账户服务
    ├── exam 考试服务
    ├── executor 执行器和验证器
    ├── lib 公用库
    └── server web服务
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

