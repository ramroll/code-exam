const Database = require('./database')

const db = new Database()

/* 账户 */
db.addColumn('account', 'password', 'varchar(32)')
db.addColumn('account', 'salt', 'varchar(30)')
db.addColumn('account', 'email', 'varchar(50)')
db.addColumn('account', 'status', 'smallint', {
  default : 0
})
db.addColumn('account', 'created', 'timestamp', {
  default : 'CURRENT_TIMESTAMP'
})

/* token */
db.addColumn('token', 'code', 'varchar(32)')
db.addColumn('token', 'account_id', 'bigint(20)', {
  nullable : true
})
db.addColumn('token', 'created', 'timestamp', {
  default : 'CURRENT_TIMESTAMP'
})

/* 验证码 */
db.addColumn('vcode', 'code', 'varchar(30)')
db.addColumn('vcode', 'account_id', 'bigint(20)', {
  nullable : true
})
db.addColumn('vcode', 'status', 'smallint', {
  default : 0
})
db.addColumn('vcode', 'type', 'varchar(20)')
db.addColumn('vcode', 'created', 'timestamp', {
  default : 'CURRENT_TIMESTAMP'
})


/* 学生 */
db.addColumn('student', 'name', 'varchar(20)')
db.addColumn('student', 'email', 'varchar(50)')
db.addColumn('student', 'nickname', 'varchar(50)')
db.addColumn('student', 'account_id', 'bigint(20)')


/* 考试 */
db.addColumn('exam', 'name', 'varchar(30)')
db.addColumn('exam', 'time', 'bigint(20) unsigned')
db.addColumn('exam', 'title', 'varchar(50)')
db.addColumn('exam', 'created', 'timestamp', {
  default : 'CURRENT_TIMESTAMP'
})


/* 提交 */
db.addColumn('submit', 'student_id', 'bigint(20) unsigned')
db.addColumn('submit', 'exam_id', 'bigint(20) unsigned')
db.addColumn('submit', 'exam', 'varchar(30)')
db.addColumn('submit', 'question', 'bigint(20) unsigned')
db.addColumn('submit', 'created', 'timestamp', {
  default : 'CURRENT_TIMESTAMP'
})
db.addColumn('submit', 'exe_time', 'int(11)', {
  nullable : true
})
db.addColumn('submit', 'message', 'varchar(255)', {
  nullable : true
})
db.addColumn('submit', 'status', 'smallint', {
  default : 0
})
db.addColumn('submit', 'code', 'varchar(2000)')

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