import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Questions from './pages/questions'
import Question from './pages/question'
import Papers from './pages/papers'
import Paper from './pages/paper'
import MyInfo from './pages/my_info'
import './styl/index.styl'

import Header from '../common/component/Header'
import { Menu, Icon } from 'antd'
import withMe from '../common/component/withMe'

import MyClassList from './pages/my_class_list'
import MyClass from './pages/my_class'
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
              defaultOpenKeys={['creative', 'personal', 'school']}
              mode='inline'
              style={{width : 300}} >
              <Menu.Item key='/inspire/my/info'><Link to='/inspire/my/info'>个人信息</Link></Menu.Item>
              <SubMenu key='school' title='班级'>
                <Menu.Item key='/inspire/my/class/create'><Link to='/inspire/my/class/create'>成立班级</Link></Menu.Item>
                <Menu.Item key='/inspire/my/classes'><Link to='/inspire/my/classes'>管理班级</Link></Menu.Item>
              </SubMenu>

              <SubMenu key='creative' title='创作'>
                <Menu.Item key='questions' ><Link to='/inspire/questions'>我出的题目</Link></Menu.Item>
                <Menu.Item key='question' ><Link to='/inspire/question'>出题</Link></Menu.Item>
                <Menu.Item key='papers'><Link to='/inspire/papers'>我出的试卷</Link></Menu.Item>
                <Menu.Item key='paper'><Link to='/inspire/paper'>出卷</Link></Menu.Item>
              </SubMenu>
            </Menu>
            <div className='page-content'>
              <Route path='/inspire' exact component={Questions} />
              <Route path='/inspire/questions' exact component={Questions} />
              <Route path='/inspire/question' exact component={Question} />
              <Route path='/inspire/question/:id' exact component={Question} />
              <Route path='/inspire/papers' exact component={Papers} />
              <Route path='/inspire/paper/:id' exact component={Paper} />
              <Route path='/inspire/paper' exact component={Paper} />
              <Route path='/inspire/my/info' exact component={MyInfo} />

              <Route path='/inspire/my/class/create' exact component={MyClass} />
              <Route path='/inspire/my/classes' exact component={MyClassList} />

            </div>

          </div>
        </div>
      </Router>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'))
