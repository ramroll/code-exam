import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Exam from './Exam'
import Home from './Home'
import ExamExplain from './ExamExplain'
import ExamExplainEdit from './ExamExplainEdit'
import ExamExplains from './ExamExplains'
import './styl/index.styl'


import Header from '../common/component/Header'

class App extends Component {

  render(){
    return (
      <Router>
        <div className='router-wrapper'>
          <Header />
          <Route path='/' exact component={Home} />
          <Route path='/exam/:name' exact component={Exam} />
          <Route path='/exam/:name/explain' exact component={ExamExplains} />
          <Route path='/exam/:name/explain/:id' exact component={ExamExplain} />
          <Route path='/exam/:name/explain/:id/edit' exact component={ExamExplainEdit} />
          <Route path='/exam/:name/explain/create' exact component={ExamExplainEdit} />
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
