const fs = require('fs')
const path = require('path')
const Testutil = require('./testutil')
const ValueNotMatchException = require('./ValueNotMatchException')
const UndefException = require('./UndefException')
process.on('message', async submit => {
  if(submit.type === 'exit') {process.exit(submit.code)}
  const {code, exam, question, tester_code} = submit
  console.log(code)

  


  let testerFunction = null
  try {
    testerFunction = eval(tester_code)
  } catch(ex) {
    console.error(ex)
    sendError(1001, '执行试卷出错')
  }
  // const tester = require(tester_path)

  const testutil = new Testutil()
  testutil.hook_console_start()
  try{
    await testerFunction(testutil, code)
    console.log(testutil.exe_time())
    process.send({
      code : 2,
      exe_time : testutil.exe_time(),
      logs : testutil.get_logs()
    })
    testutil.hook_console_end()
  }catch(ex) {
    testutil.hook_console_end()
    if(ex instanceof ValueNotMatchException) {
      if(typeof ex.val1 !== 'object' && typeof ex.val2 !== 'object') {
        sendError(101,  `${ex.val1}!==${ex.val2} 结果不正确`, testutil.get_logs())
        return
      }else {
        sendError(101, `结果不正确:` + ex.message, testutil.get_logs())
        return
      }
    }
    else if(ex instanceof UndefException) {
      sendError(104, ex.entity + '未定义', testutil.get_logs())
      return
    }
    else {
      if(typeof ex !== 'object') {
        sendError(1000, ex, testutil.get_logs())
      } else {

        sendError(1000, ex.message, testutil.get_logs())
      }
      return
    }
  }

})


function sendError(code, message, logs){
  process.send({
    code,
    message,
    logs
  })
}



setTimeout(() => {
  sendError(100, `执行超时(3s限制)`)
}, 3000)