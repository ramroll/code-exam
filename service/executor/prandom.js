/**
 * 为随机数产生
 * 生产批量随机结果
 */

let seed = 1
class PRamdomUtil{

  prandom() {
    const x = Math.sin(seed++) * 100000
    return x - Math.floor(x)
  }

  word(min, max){
    const l = min + Math.floor( this.prandom() * (max - min + 1) )

    let s = ''
    for(let i = 0; i < l; i++) {
      s += String.fromCharCode(97 + Math.floor( this.prandom() * 26) )
    }
    return s
  }
}



