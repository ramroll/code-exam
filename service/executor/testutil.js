const ValueNotMatchException = require('./ValueNotMatchException')
const UndefException = require('./UndefException')
const deepEqual = require('deep-equal')
class Testutil {

  begin(){
    this.begin = process.hrtime()
  }

  undef(entity){
    throw new UndefException(entity)
  }

  end(){
    this.end = process.hrtime()
  }
  equal(val1, val2){
    if(val1 !== val2) {
      throw new ValueNotMatchException(val1, val2)
    }
  }

  deepEqual(val1, val2) {
    if(!deepEqual(val1, val2)) {
      throw new ValueNotMatchException(val1, val2)
    }
  }

  exe_time(){
    return (this.end[0] - this.begin[0]) * 1000000 + (this.end[1] - this.begin[1]) / 1000
  }
}

module.exports = Testutil