const Database = require('../db/database')

const db = new Database()

/* 账户 */
db.addColumn('account', 'name', 'varchar(30)')
db.addColumn('account', 'passwd', 'varchar(30)')
db.addColumn('account', 'salt', 'varchar(30)')
db.addColumn('account', 'email', 'varchar(50)')
db.addColumn('account', 'created', 'timestamp', {
  default : 'CURRENT_TIMESTAMP'
})


/* 验证码 */
db.addColumn('vcode', 'code', 'varchar(30)')
db.addColumn('vcode', 'created', 'timestamp', {
  default : 'CURRENT_TIMESTAMP'
})


/* 学生 */
db.addColumn('student', 'name', 'varchar(20)')


/* 考试 */
db.addColumn('exam', 'name', 'varchar(30)')
db.addColumn('exam', 'time', 'bigint(20) unsigned')


/* 提交 */
db.addColumn('submit', 'student_id', 'bigint(20) unsigned')
db.addColumn('submit', 'exam_id', 'bigint(20) unsigned')
db.addColumn('submit', 'question', 'bigint(20) unsigned')
db.addColumn('submit', 'created', 'timestamp', {
  default : 'CURRENT_TIMESTAMP'
})
db.addColumn('submit', 'status', 'smallint')

console.log( db.toSql() )

