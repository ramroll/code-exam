const Database = require('./database')

const db = new Database()

/* 账户 */
db.addColumn('account', 'password', 'varchar(32)', '密码')
db.addColumn('account', 'salt', 'varchar(30)', '盐')
db.addColumn('account', 'email', 'varchar(50)', 'email')
db.addColumn('account', 'status', 'smallint', '状态:0-未激活 1-激活', {
  default : 0
})
db.addColumn('account', 'created', 'timestamp', '创建时间', {
  default : 'CURRENT_TIMESTAMP'
})

/* token */
db.addColumn('token', 'code', 'varchar(32)', 'code')
db.addColumn('token', 'account_id', 'bigint(20)', '账户ID', {
  nullable : true
})
db.addColumn('token', 'created', 'timestamp', '创建时间', {
  default : 'CURRENT_TIMESTAMP'
})

/* 验证码 */
db.addColumn('vcode', 'code', 'varchar(30)', 'code')
db.addColumn('vcode', 'account_id', 'bigint(20)', '账户ID', {
  nullable : true
})
db.addColumn('vcode', 'status', 'smallint', '状态 0-未使用 1-已使用', {
  default : 0
})
db.addColumn('vcode', 'type', 'varchar(20)', '类型表示注册、找回等等')
db.addColumn('vcode', 'created', 'timestamp', '创建时间', {
  default : 'CURRENT_TIMESTAMP'
})


/* 学生 */
db.addColumn('student', 'name', 'varchar(20)', '姓名')
db.addColumn('student', 'email', 'varchar(50)', '邮箱')
db.addColumn('student', 'nickname', 'varchar(50)', '昵称')
db.addColumn('student', 'account_id', 'bigint(20)', '账户ID')


/* 考试 */
db.addColumn('exam', 'name', 'varchar(30)', '考试英文代号')
db.addColumn('exam', 'time', 'bigint(20) unsigned', '考试时长，秒')
db.addColumn('exam', 'title', 'varchar(50)', '标题')
db.addColumn('exam', 'created', 'timestamp', '创建时间', {
  default : 'CURRENT_TIMESTAMP'
})

/* 题目 */
db.addColumn('question', 'md', 'text', '题目说明')
db.addColumn('question', 'sample', 'text', '题目示例-placehodler')
db.addColumn('question', 'tester', 'text', '题目测试')
db.addColumn('question', 'account_id', 'bigint(20)', '出题人ID')
db.addColumn('question', 'scorealg', 'varchar(20)', '打分算法')
db.addColumn('question', 'scoreconf', 'varchar(500)', '打分设置JSON')

/* 提交 */
db.addColumn('submit', 'student_id', 'bigint(20) unsigned', '学生ID')
db.addColumn('submit', 'exam_id', 'bigint(20) unsigned', '考试ID')
db.addColumn('submit', 'exam', 'varchar(30)', '考试名称')
db.addColumn('submit', 'question', 'bigint(20) unsigned', '问题编号')
db.addColumn('submit', 'created', 'timestamp', '创建时间', {
  default : 'CURRENT_TIMESTAMP'
})
db.addColumn('submit', 'exe_time', 'int(11)', '执行时间', {
  nullable : true
})
db.addColumn('submit', 'message', 'varchar(255)', '错误提示', {
  nullable : true
})
db.addColumn('submit', 'status', 'smallint', '状态:0-提交 1-已分配执行器 2-执行成功 >2执行失败', {
  default : 0
})
db.addColumn('submit', 'code', 'varchar(2000)', '提交的代码')

/* 索引 */
db.addIndex('account', 'email', 'uniq')
db.addIndex('student', 'account_id', 'uniq')
db.addIndex('submit', ['status', 'id'])



/* 数据 */
db.addData('exam', {
  time : 3600*24*7,
  name : 'test',
  title : '测试题目'
})
console.log( db.toSql() )