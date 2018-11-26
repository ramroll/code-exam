import React, {Component} from 'react'

import request from '../../common/util/request'

import {Button} from 'antd'


export default class Enroll extends Component {

  constructor(){
    super()

    this.state = {
      cls : null
    }
  }


  componentWillMount() {
    request(`/api/school/my/class/${this.props.match.params.id}/apply`)
      .then(data => {
        this.setState({
          cls : data
        })
      })
  }



  render(){

    if(!this.state.cls) {
      return null
    }

    return <div className='flex-center full'>

      <h1>你要报名参加<strong>「{this.state.cls.name}」</strong>吗？</h1>
      <p>{this.state.cls.intro}</p>

      <Button type='primary'>申请参加</Button>

    </div>

  }
}