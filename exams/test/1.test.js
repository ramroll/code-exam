function tester(testutil, code) {
  eval(code)
  if(typeof sum !== 'function') {
    testutil.undef(`sum`)
  }

  testutil.begin()
  testutil.equal(sum(100), 5050)
  testutil.equal(sum(1000), 500500)
  testutil.end()
}


module.exports = tester