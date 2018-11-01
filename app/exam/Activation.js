import React, {Component} from 'react'

import request from '../lib/request'
import qs from 'qs'

export default class Activation extends Component {
  constructor(){
    super()

    this.state = {
      text : '...'
    }
  }

  componentWillMount(){

    const search = this.props.location.search.substr(1)
    const query = qs.parse(search)
    request('/api/account/activation?code=' + query.code)
      .then(data => {
        this.setState({
          text : '激活成功'
        })
      })
      .catch(err => {
        this.setState({
          text : err.error
        })

      })

  }
  render(){
    return <div className='full flex-center'>
      <h1>{this.state.text}</h1>
    </div>
  }
}