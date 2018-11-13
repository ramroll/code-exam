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

  constructor(){
    this.logs = []
  }
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

  /**
   * Hook console log
   */
  hook_console_start() {
    this._clog = console.log

    global.console.log = (...args) => {
      this.logs.push(args)
      this._clog(...args)
    }
  }

  /**
   * Hook console end
   */
  hook_console_end() {
    global.console.log = this._clog
  }


  get_logs() {
    let lines = []
    for(let i = 0; i < this.logs.length; i++) {
      const args = this.logs[i]
      if(args.length === 1) {
        lines.push(object_to_log(args[0]))
      } else {
        lines.push(args.map(arg => {
          if(typeof arg === 'object') {
            if(Array.isArray(arg)) {
              return '<Array ...>'
            }
            return '<Object ...>'
          }
          return arg
        }).join(' '))
      }
    }
    return lines.join('\n')
  }
}

/**
 * 将对象转换成日志，最多支持100个成员
 * @param {*} obj
 * @param {*} level
 */
function object_to_log(obj, level = 0){
  if(level === undefined) {
    throw 'error'
  }

  if(typeof obj === 'function') {
    return 'Function ' + obj.name
  }
  else if(typeof obj === 'object') {
    if(Array.isArray(obj)) {
      if(level >= 2) {
        return '<Array...>'
      }
      const subArray = obj.slice(0, 100)
      const r = []
      for(let i = 0; i < subArray.length; i++) {
        r.push(object_to_log(obj[i], level + 1))
      }
      return obj.length > 100 ? `[${r.join(',')}...]` : `[${r.join(',')}]`
    }


    if(level >= 2) {
      return '<Object...>'
    }
    const keys = Object.keys(obj).slice(0, 100)
    const mockObj ={}

    let kvs = []
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (typeof obj[key] === 'string') {
        kvs.push(''.padStart(2*(level + 1)) + `${key} : '${object_to_log(obj[key], level + 1)}'`)
      } else {
        kvs.push(''.padStart(2*(level + 1)) + `${key} : ${object_to_log(obj[key], level + 1)}`)
      }
    }
    if(keys.length > 100) {
      kvs.push(''.padStart((level + 1) * 2) + '...')
    }
    return ''.padStart(level * 2) + `{\n` + kvs.join(",\n") +`\n` + ''.padStart(level*2) + `}`
  }
  else {
    if(typeof obj === 'string') {
      return obj.length > 100 ? obj.substr(0, 100) + '...' : obj
    }
    return obj
  }
}



module.exports = Testutil