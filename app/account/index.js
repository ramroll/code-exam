import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Activation from './Activation'
import RegisterSuccess from './RegisterSuccess'
import Logout from './Logout'
import './styl/index.styl'

import Header from '../common/component/Header'

class App extends Component {

  render(){
    return (
      <Router>
        <div className='router-wrapper'>
          <Header />
          <Route path='/account/login' component={Login} />
          <Route path='/account/register' component={Register} />
          <Route path='/account/regsucc' component={RegisterSuccess} />
          <Route path='/account/activation' component={Activation} />
          <Route path='/account/logout' component={Logout} />
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
