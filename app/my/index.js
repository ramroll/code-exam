import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import MyInfo from './pages/my_info'
import './styl/index.styl'

import Header from '../common/component/Header'
import { Menu, Icon } from 'antd'
import withMe from '../common/component/withMe'

import MySubmit from './pages/my_submit'
import MyExam from './pages/my_exam'
import MyClass from './pages/my_class'
import Enroll from './pages/enroll'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;



@withMe()
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
              defaultOpenKeys={['study']}
              mode='inline'
              style={{width : 300}} >
              <Menu.Item key='/my'><Link to='/my'>个人信息</Link></Menu.Item>
              <SubMenu key='study' title='学习'>
                <Menu.Item key='/my/class'><Link to='/my/class'>我参与的班级</Link></Menu.Item>
                {/* <Menu.Item key='/my/submit'><Link to='/my/submit'>我的提交</Link></Menu.Item> */}
                {/* <Menu.Item key='/my/exam'><Link to='/my/submit'>我的考试</Link></Menu.Item> */}
              </SubMenu>
           </Menu>
            <div className='page-content'>
              <Route path='/my' exact component={MyInfo} />
              <Route path='/my/class' exact component={MyClass} />
              <Route path='/my/enroll/:id' exact component={Enroll} />
              {/* <Route path='/my/submit' exact component={MySubmit} />
              <Route path='/my/exam' exact component={MyExam} /> */}
            </div>
          </div>
        </div>
      </Router>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'))
