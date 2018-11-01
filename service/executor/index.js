const Db = require('../lib/db/db')
const child_process = require('child_process')
async function executor() {
  const db = new Db()
  const submit = await fetchOne(db)
  if(!submit) {
    console.log('没有要执行的submit')
    process.exit(0)
  }

  const code = submit.code
  const cp = child_process.fork(__dirname + '/executor.js')


  cp.send({
    exam: submit.exam,
    question : 0,
    code
  })

  cp.on('message', result => {
    if(result.code >= 100) {
      error_handler(db, submit, result.code, result.message)
        .then(() => {
          console.log(`${submit.student_id}提交了错误的答案`)
          cp.send({ type: 'exit', code: 0 })
        })
    }
    if(result.code === 2) {
      success_handler(db, submit, result.exe_time)
      .then(() => {
        console.log(`${submit.student_id}提交了正确的答案`)
        cp.send({ type: 'exit', code: 0 })
      })
      .catch(ex => {
        console.error(ex)
      })
    }

  })

  cp.on('exit', (code) => {
    process.exit(0)
  })


}

function run(){
  console.log('here')
}


async function success_handler(db, submit, time) {
  await db.update('submit', {
    id : submit.id,
    status : 2,
    exe_time : time
  })
}

async function error_handler(db, submit, code, message) {
  await db.update('submit', {
    id : submit.id,
    status : code,
    message
  })
}

async function fetchOne(db) {
  try {
    await db.lock('submit')
    const sql = `select * from submit order by status,id limit 1`
    const submit = await db.queryOne(sql)
    if(submit.status === 0) {
      return submit
    }
    return null
  } finally {
    await db.unlock()
  }
}


executor()