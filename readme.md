## coding考试系统

### 目录结构
```
--app 前端项目
|----exam 考试系统
-- scripts 脚本和工具
|----server web服务工具
|----webpack webpack配置
-- service 服务端项目
|----account 账户服务(注册/邮件发送/验证/找回)
|----submitter 代码提交和验证服务
|----stat 数据统计服务
--db 数据库工具
```


### 依赖

nomnon - 命令行参数处理
pm2 - 进程管理
mysql - mysql连接
sql-formatter - sql语句格式化（美观)
nodemailer - 发送邮件
