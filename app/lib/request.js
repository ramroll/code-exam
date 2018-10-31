
export default function request(url, options = {}) {
  options.headers = {
    'Content-Type': 'application/json; charset=utf-8',
    TOKEN : localStorage['XTOKEN']
  }
  if(options && options.body) {
    options.body = JSON.stringify(options.body)
  }
  return fetch(url, options)
    .then(resp => {
      if(resp.status === 404) {
        throw {error : '网络错误'}
      }
      const token = resp.headers.get('TOKEN')
      localStorage['XTOKEN'] = token
      return resp.json()
    })
    .then(jsonData => {
      if(jsonData.error) {
        throw jsonData
      }
      return jsonData
    })
}

