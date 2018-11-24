
import React, {Component} from 'react'
import request from '../util/request'

const MeContext = React.createContext('me')
export default function withMe(){
  return Target => {

    class WithMeProxy extends Component{

      constructor(){
        super()

        this.state = { 
          loading : true,
          student : null
        }
      }
      componentDidMount(){

        request('/api/account/me')
          .then(data => {
            this.setState({
              student : data,
              loading : false
            })
          })
      }
      render(){
        if(this.state.loading){return null}
        return <MeContext.Provider value={this.state.student}>
          <Target {...this.props} />
        </MeContext.Provider>

      }
    }
    return WithMeProxy
  }
}

withMe.Context = MeContext