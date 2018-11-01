const ValuteNotMatchException = require('./ValueNotMatchException')
const deepEqual = require('deep-equal')
class Testutil {

  begin(){
    this.begin = process.hrtime()
  }

  end(){
    this.end = process.hrtime()
  }
  equal(val1, val2){
    if(val1 !== val2) {
      throw new ValuteNotMatchException(val1, val2)
    }
  }

  deepEqual(val1, val2) {
    if(!deepEqual(val1, val2)) {
      throw new ValuteNotMatchException(val1, val2)
    }
  }

  exe_time(){
    return (this.end[0] - this.begin[0]) * 1000000 + (this.end[1] - this.begin[1]) / 1000
  }
}

module.exports = Testutil