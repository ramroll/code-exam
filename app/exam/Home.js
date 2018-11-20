import React, {Component} from 'react'

import request from '../common/util/request'
import qs from 'qs'
import Header from '../common/component/Header'
import withMe from '../common/component/withMe'



export default @withMe() class Home extends Component {

  render(){
    return <div className='full flex-center flex-column'>

      {!this.props.name && <h2><a href='/register'>注册</a><span>        </span><a href='/account/login'>登录</a></h2>}
      <div className='papers'>
        <div className='paper-item'>
          <a href='/exam/test'>算法能力自测卷</a>
        </div>
        <div className='paper-item'>
          <a href='/exam/practise2'>基础模拟训练2</a>
        </div>
      </div>
    </div>
  }
}