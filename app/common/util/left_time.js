/**
 * 计算和展示考试结束时间 
 * @param {*} left 
 */
export default function left_time(left){
  if(left < 0) left = -left
  const d = Math.floor( left / (3600*1000*24) )
  left -= d * 3600*1000*24
  const h = Math.floor ( left / (3600*1000) )
  left -= h * 3600 * 1000
  const min = Math.floor( left / (60 * 1000))
  left -= min * 60 * 1000
  const second = Math.floor(left / 1000)

  let str = ''
  if(d) {str += d + '天'}
  if(d||h) {str += pad(h) + '时'}
  if(d||h||min) { str += pad(min) + '分'}
  str += pad(second)+'秒'
  return str
}

function pad(v) {
  return (v + '').padStart(2, '0')
}

