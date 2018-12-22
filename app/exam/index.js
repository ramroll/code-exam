import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import Exam from './Exam'
import Home from './Home'


import './styl/index.styl'


import Header from '../common/component/Header'

import withMe from '../common/component/withMe'

const Loading = () => <span>Loading...</span>


function withDynamicImport(load) {

  class DynamicImport extends Component {
    state = {
      component: null
    }
    componentDidMount() {
      load()
        .then((component) => {
          this.setState(() => ({
            component : component.default
          }))
        })
    }
    render() {
      if (!this.state.component) {
        return <Loading />
      }
      return <this.state.component {...this.props} />
    }
  }
  return DynamicImport

}

const Exam = withDynamicImport(()=>import('./Exam'))
const ExamExplain = withDynamicImport(()=>import('./ExamExplain'))
const ExamExplainEdit = withDynamicImport(()=>import('./ExamExplainEdit'))
const ExamAnswer = withDynamicImport(()=>import('./Answer'))
const ExamExplains = withDynamicImport(()=>import('./ExamExplains'))
@withMe()
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
          <Route path='/exam/:name/answer' exact component={ExamAnswer} />
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
