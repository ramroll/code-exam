import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Exam from './Exam'
import Login from './Login'
import Register from './Register'
import Activation from './Activation'
import RegisterSuccess from './RegisterSuccess'
import Home from './Home'
import './styl/index.styl'

import Header from '../common/component/Header'

class App extends Component {

  render(){
    return (
      <Router>
        <div className='router-wrapper'>
          <Header />
          <Route path='/' exact component={Home} />
          <Route path='/exam' component={Exam} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/regsucc' component={RegisterSuccess} />
          <Route path='/activation' component={Activation} />
        </div>
      </Router>
    )
  }
}
if (module.hot) {
  module.hot.accept(function(...args) {
    console.log('here', args)
  })
}
ReactDOM.render(<App />, document.getElementById('app'))
