import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import withMe from './withMe'
import './header.styl'

const MeContext = withMe.Context

export default class Header extends Component {
  static contextType = MeContext
  render(){
    const {nickname} = this.context || {}
    const login = !!nickname
    return <div className='header'>
      <div className='logo'>
        <img src={require('../../../static/img/horse.png')} />
        <h2>专注算法学习，提高编码效率</h2>
      </div>

      <div className='u'>
        <div className='circle'>
          {nickname && nickname[0]}
        </div>
        <div className='top-menu'>
          {!login && <div className='item'>
            <a href='/account/login'>登录</a>
          </div>}
          {!login && <div className='item'>
            <a href='/account/register'>注册</a>
          </div>}


          {login && <div className='item'>
            <a href='/inspire'>创作中心</a>
          </div>}
          {login && <div className='item'>
            <a href='/account/logout'>登出</a>
          </div>
          }
        </div>
      </div>
    </div>
  }
}