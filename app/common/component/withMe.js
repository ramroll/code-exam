
import React, {Component} from 'react'
import request from '../util/request'

const MeContext = React.createContext('me')
export default function withMe(){
  return Target => {

    class WithMeProxy extends Component{

      constructor(){
        super()

        this.state = {
          student : null
        }
      }
      componentDidMount(){

        request('/api/account/me')
          .then(data => {
            this.setState({
              student : data
            })
          })
      }
      render(){
        return <MeContext.Provider value={this.state.student}>
          <Target {...this.props} />
        </MeContext.Provider>

      }
    }
    return WithMeProxy
  }
}

withMe.Context = MeContext