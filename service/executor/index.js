const Db = require('../lib/db/db')
const child_process = require('child_process')
const ExecQueue = require('../lib/queue/exec_queue')

const queue = new ExecQueue()
function executor() {

  return new Promise(async (resolve, reject) => {

    const db = new Db()
    const submit = await fetchOne(db)
    if (!submit) {
      // console.log('没有要执行的submit')
      resolve()
      return
    }
    console.log('找到一个要执行的submit')

    const code = submit.code
    const cp = child_process.fork(__dirname + '/executor.js')


    let finished = false
    setTimeout(() => {

      if(!finished) {

        console.log('here---')
        cp.kill('SIGINT')
        console.log('killed---')
        error_handler(db, submit, 100, '执行超出3s限制')
          .then(() => {
            console.log(`${submit.student_id}超时`)
          })
      }
    }, 3000)


    cp.send({
      exam: submit.exam,
      question : submit.question,
      code,
      tester_code : submit.tester_code
    })

    cp.on('message', result => {
      if (result.code >= 100) {

        finished = true
        error_handler(db, submit, result.code, result.message, result.logs)
          .then(() => {
            console.log(`${submit.student_id}提交了错误的答案`)
            cp.send({ type: 'exit', code: 0 })
          })
      }
      if (result.code === 2) {

        finished = true
        success_handler(db, submit, result.exe_time, result.logs)
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
      resolve()
    })

  })

}

function run(){
  console.log('here')
}


async function success_handler(db, submit, time, logs) {
  await db.update('submit', {
    id : submit.id,
    status : 2,
    exe_time : time,
    console : logs
  })

}

async function error_handler(db, submit, code, message, logs) {
  await db.update('submit', {
    id : submit.id,
    status : code,
    message,
    console : logs
  })
}

async function fetchOne(db) {
  try {
    const id = await queue.dequeue()
    if(!id) {
      return null
    }

    const sql = `select * from submit where id=${id}`
    const submit = await db.queryOne(sql)
    if(!submit) {return null}
    const question = await db.queryOne(`select tester from question where id=${submit.question}`)
    submit.tester_code = question.tester
    return submit
  }  catch(ex) {
    console.error(ex)
  }
  finally {
    // await db.unlock()
  }
}


async function sleep(ms) {
  return new Promise( (resolve) => {
    setTimeout(() => {

      resolve()
    }, ms)

  })
}

async function start(){

  while(true) {
    const promise = await executor()
    await promise
    await sleep(300)
  }
}


start()