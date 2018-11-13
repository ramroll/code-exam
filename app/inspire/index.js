import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Questions from './pages/questions'
import './styl/index.styl'

import Header from '../common/component/Header'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;



class App extends Component {

  constructor(){
    super()

    /**
     * 计算当前应该是哪个菜单
     */
    const key = window.location.pathname.replace(/\/inspire(\/?)/, '')
      || 'my-question'

    console.debug('route-key:', key)
    this.state = {
      routeKey : key
    }
  }

  render(){
    return (
      <Router>
        <div className='router-wrapper'>
          <Header />
          <div className='page'>
            <Menu
              defaultSelectedKeys={[this.state.routeKey]}
              mode='inline'
              style={{width : 256}} >
              <Menu.Item key='my-question'>我出的题目</Menu.Item>
              <Menu.Item key='my-paper'>我出的试卷</Menu.Item>
            </Menu>
            <Route path='/' exact component={Questions} />
            <Route path='/my-question' exact component={Questions} />
          </div>
        </div>
      </Router>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'))
