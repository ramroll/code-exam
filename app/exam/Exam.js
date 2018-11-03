import React, { Component } from 'react'

import { Button, message } from 'antd'
import request from '../lib/request'
import Question from './Question'
import Timer from './Timer'
import Rank from './Rank'
import {tract_submit, tract_view_paper} from '../lib/tract'

@withExam()
export default class Exam extends Component {
  render() {
    return <div className='paper'>
      <Rank exam={this.props.name} />
      <h1>{this.props.title}<Timer left={this.props.left} /></h1>

      {this.props.questions.map( (question, i) => {
        return <Question
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

