
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
  try {
    return fetch(url, options)
      .then(resp => {
        /// TODO 不是很合理
        if (resp.status === 404) {
          throw { error: '网络错误' }
        }

        if (resp.status === 401 && options.method === 'GET') {
          window.location.href = '/login?next=' + encodeURIComponent(location.href)
          return
        }
        const token = resp.headers.get('TOKEN')
        if (token && token !== 'null') {
          localStorage['XTOKEN'] = token
        }
        return resp.json()
      })
      .then(jsonData => {
        if (jsonData.error) {
          throw jsonData
        }
        return jsonData
      })

  }catch(ex) {
    console.error(ex)
    return Promise.reject({
      error : '网络错误'
    })
  }
}

