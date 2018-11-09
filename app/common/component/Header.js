import React, {Component} from 'react'

import withMe from './withMe'
import './header.styl'

export default @withMe() class Header extends Component {
  render(){
    return <div className='header'>
      <div className='logo'>
        <img src={require('../../../static/img/alg.png')} />
        <h2>专注算法学习，提高编码效率</h2>
      </div>

      <div className='u'>
        <div className='circle'>{this.props.nickname && this.props.nickname[0]}</div>
      </div>
    </div>
  }
}