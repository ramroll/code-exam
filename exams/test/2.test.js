function tester(testutil, code) {
  eval(code)
  if(typeof add !== 'function') {
    testutil.undef(`add`)
  }

  testutil.begin()
  testutil.equal(add(101, 102), 203)
  testutil.end()
}


module.exports = tester