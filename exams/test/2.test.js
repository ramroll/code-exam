function tester(testutil, code) {
  eval(code)
  if(typeof add !== 'function') {
    testutil.undef(`permutation`)
  }

  testutil.begin()
  testutil.deepEqual(permutation('xyz'), [ 'xyz', 'xzy', 'yxz', 'yzx', 'zxy', 'zyx' ])
  const n7 = permutation('abcdefg').length
  const n8 = permutation('abcdefgh').length
  testutil.equal(n7, 40220)
  testutil.equal(n8, 362780)
  testutil.end()
}


module.exports = tester