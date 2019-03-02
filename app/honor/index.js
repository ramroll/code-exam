import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route} from 'react-router-dom'
import Class from './page/class'

class App extends Component {

  render(){
    return (
      <BrowserRouter>
        <div>
          <Route path='/honor/class/:id' component={Class} />
        </div>
      </BrowserRouter>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'))
