import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Exam from './Exam'
import './styl/index.styl'

class App extends Component {
  render(){
    return (
      <Router>
        <Route path='/exam' component={Exam} />
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
