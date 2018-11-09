
import React, {Component} from 'react'
import request from '../util/request'
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
        return <Target {...this.state.student} />
      }
    }
    return WithMeProxy
  }
}
