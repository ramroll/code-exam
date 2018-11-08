import React, { Component } from 'react'

import { Button, message } from 'antd'
import request from '../lib/request'
import Timer from './Timer'
import Rank from './Rank'
import {tract_submit, tract_view_paper} from '../lib/tract'

export default @withExam() class Exam extends Component {

  constructor(){
    super()
    this.state = {
      QuestionComponent : null
    }
  }
  componentDidMount(){

    // Question比较大，包括markdown-it和codemirror两个大库
    // 使用Dynamic import访问
    import('./Question').then(Question => {
      this.setState({
        QuestionComponent : Question.default
      })
    })
  }
  render() {
    return <div className='paper'>
      <Rank exam={this.props.name} />
      <h1>{this.props.title}<Timer left={this.props.left} /></h1>

      {this.state.QuestionComponent && this.props.questions.map( (question, i) => {
        const { QuestionComponent } = this.state
        return <QuestionComponent
          exam={this.props.name} question={question} key={i} index={i} />
      })}

    </div>
  }
}



function withExam() {

  return Target => {

    class ExamProxy extends Component {
      constructor(props) {
        super()
        this.name = location.pathname.split('/').pop()
        this.state = {
          exam : null,
          error : null
        }
      }

      componentWillMount() {
        request('/api/exam/paper?name=' + this.name)
          .then(data => {
            tract_view_paper(data.name)
            this.setState({ exam: data})
          })
          .catch(ex => {
            this.setState({
              error : ex.error
            })
          })
      }

      render() {
        if(this.state.error) {
          return <div className='full flex-center'><h1>{this.state.error}</h1></div>
        }
        if(!this.state.exam) {
          return null
        }
        return <Target {...this.state.exam} />
      }
    }
    return ExamProxy
  }
}

