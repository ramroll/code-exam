const ValueNotMatchException = require('./ValueNotMatchException')
const UndefException = require('./UndefException')
const deepEqual = require('deep-equal')


let seed = 1

function psedo_random() {
  const x = Math.sin(seed ++ ) * 100000
  return x - Math.floor(x)
}

let rnd = null
class Testutil {

  /**
   * 使用伪随机数替代随机数
   * 让测试更加稳定
   */
  psedo_start() {
    rnd = Math.random
    Math.random = psedo_random
  }

  /**
   * 切换回真的随机数
   */
  psedo_end() {
    Math.random = rnd
  }

  /**
   * 计时开始
   */
  begin(){
    this.begin = process.hrtime()
  }


  undef(entity){
    throw new UndefException(entity)
  }

  /**
   * 计时结束
   */
  end(){
    this.end = process.hrtime()
  }
  equal(val1, val2, message){
    if(val1 !== val2) {
      throw new ValueNotMatchException(val1, val2, message)
    }
  }


  deepEqual(val1, val2) {
    if(!deepEqual(val1, val2)) {
      throw new ValueNotMatchException(val1, val2, '深度比较失败')
    }
  }

  exe_time(){
    return (this.end[0] - this.begin[0]) * 1000000 + (this.end[1] - this.begin[1]) / 1000
  }
}

module.exports = Testutil