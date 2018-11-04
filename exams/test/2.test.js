function tester(testutil, code) {
  
  eval(code)
  if(typeof permutation !== 'function') {
    testutil.undef(`permutation`)
  }

  testutil.begin()
  testutil.deepEqual(permutation('xyz').sort(), [ 'xyz', 'xzy', 'yxz', 'yzx', 'zxy', 'zyx' ].sort())
  const n7 = permutation('abcdefgh').length
  const n8 = permutation('abcdefghi').length
  testutil.equal(n7, 40320)
  testutil.equal(n8, 362880)
  testutil.end()
}


module.exports = tester