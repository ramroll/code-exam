import React, {Component} from 'react'

import request from '../lib/request'
import qs from 'qs'

export default class RegisterSuccess extends Component {

  render(){
    return <div className='full flex-center'>
      <h1>注册成功，请登录您的邮箱点开激活链接</h1>
    </div>
  }
}