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


  submit = () => {

    request(`/api/school/my/class/${this.props.match.params.id}/apply`, {
      method : 'POST',
    })
      .then(data => {
        window.location.reload()
      })
  }

  renderAvatar(student) {

    if(student.avatar) {
      return <div className='student'>
        <img src={student.avatar} />
        <div className='name'>{student.name}</div>
      </div>
    }
    else {
      return <div className='student'>
        <div className='avatar'>{student.nickname[0]}</div>
        <div className='name'>{student.name}</div>
      </div>

    }

  }


  render(){

    if(!this.state.cls) {
      return null
    }

    const {status} = this.state.cls

    const disabled = !!this.state.cls.apply
    let text = '申请参加'

    if(this.state.cls.apply) {
      const status = this.state.cls.apply.status
      if(status === 'apply') {
        text = '请等待班级管理员处理'
      }
      else if(status === 'verified'){
        text = '您已经在这个班级'
      }
    }

    return <div className='flex-center full'>

      <h1>{this.state.cls.name}</h1>
      <p>{this.state.cls.intro}</p>
      <Button type='primary' onClick={this.submit} disabled={disabled}>{text}</Button>
      <hr />

      <div className='student-list'>
        {this.state.cls.students.map((student, i) => {
          return <div key={i}>{this.renderAvatar(student)}</div>
        })}
      </div>


    </div>

  }
}