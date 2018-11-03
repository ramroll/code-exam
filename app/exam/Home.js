import React, {Component} from 'react'

import request from '../lib/request'
import qs from 'qs'

export default class Home extends Component {

  render(){
    return <div className='full flex-center'>
      <h1>首页正在建设中，请使用其他功能</h1>
      <a href='/exam/test'>测试试卷</a>
    </div>
  }
}