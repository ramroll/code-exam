const fs = require('fs')
const path = require('path')
const Testutil = require('./testutil')
const ValueNotMatchException = require('./ValueNotMatchException')
process.on('message', submit => {
  if(submit.type === 'exit') {process.exit(submit.code)}
  const {code, exam, question} = submit
  const exam_dir = path.resolve( process.env.EXAM_DIR, exam )

  if(!fs.existsSync(exam_dir)) {
    sendError(102, '考试不存在')
    return
  }


  const tester_path = path.resolve( process.env.EXAM_DIR, exam, (question+1) + '.test.js')
  const tester = require(tester_path)

  const testutil = new Testutil()
  try{
    tester(testutil, code)
    process.send({
      code : 2,
      exe_time : testutil.exe_time()
    })
  }catch(ex) {
    if(ex instanceof ValueNotMatchException) {
      if(typeof ex.val1 !== 'object' && typeof ex.val2 !== 'object') {
        sendError(101,  `${ex.val1}!==${ex.val2} 结果不正确`)
        return
      }
    }
  }

})


function sendError(code, message){
  process.send({
    code,
    message
  })
}



setTimeout(() => {
  sendError(100, `执行超时(3s限制)`)
}, 3000)