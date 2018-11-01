
export default function request(url, options = {}) {
  const def = {
    method : 'GET'
  }

  options = {...def, ...options}

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
      if(resp.status === 401 && options.method === 'GET') {
        debugger
        window.location.href = '/login?next=' + encodeURIComponent(location.href)
        return
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

