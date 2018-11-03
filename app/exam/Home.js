import React, {Component} from 'react'

import request from '../lib/request'
import qs from 'qs'

export default class Home extends Component {

  render(){
    return <div className='full flex-center flex-column'>
      <h1>专注算法学习，提高编码效率</h1>
      <h2><a href='/register'>注册</a><span>        </span><a href='/login'>登录</a></h2>
      <div><a href='/exam/test'>测试试卷</a></div>
    </div>
  }
}