import React, { Component } from 'react'
import MarkdownIt from 'markdown-it'
import ReactDOM from 'react-dom'

import { Button, message } from 'antd'

import request from '../lib/request'


@withExam()
export default class Exam extends Component {
  render() {
    return <div className='paper'>
      <h1>{this.props.title}<Timer left={this.props.left} /></h1>
      {this.props.questions.map( (question, i) => {
        return <Question
          exam={this.props.name} question={question} key={i} index={i} />
      })}
    </div>
  }
}


class Timer extends Component{

  constructor(props){
    super()
    this.state = {
      left : props.left
    }
  }
  componentWillMount(){
    let t = new Date().getTime()
    this.I = setInterval( () => {
      const d = new Date().getTime() - t
      const left = this.props.left - d
      if(left > 0) {
        this.setState({
          left
        })
      } else {
        this.setState({
          left : 0
        })
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.I)
  }

  render(){
    if(!this.state.left) {
      return <span>已结束</span>
    }

    return <span className='timer'>{toTime(this.state.left)}</span>
  }
}


function toTime(left){
  const d = Math.floor( left / (3600*1000*24) )
  left -= d * 3600*1000*24
  const h = Math.floor ( left / (3600*1000) )
  left -= h * 3600 * 1000
  const min = Math.floor( left / (60 * 1000))
  left -= min * 60 * 1000
  const second = Math.floor(left / 1000)

  let str = ''
  if(d) {str += d + '天'}
  if(d||h) {str += h + '时'}
  if(d||h||min) { str += min + '分'}
  str += second+'秒'
  return str
}


class Question extends Component{

  constructor(props){
    super()

    this.state = {
      question : props.question
    }
  }

  componentDidMount(){
    const domNode = ReactDOM.findDOMNode(this.r)
    this.cm = CodeMirror.fromTextArea(domNode, {
      mode : 'javascript'
    })
  }

  wait = () => {

    this.I = setInterval( () => {
      request(`/api/exam/paper?name=${this.props.exam}`)
        .then(paper => {
          const question = paper.questions[this.props.index]
          this.setState({question})
        })
    }, 2000)
  }

  componentWillUnmount(){
    this.I && clearInterval(this.I)
  }

  submit = () => {
    const code = this.cm.getValue()

    request('/api/exam/submit', {
      method : 'POST',
      body : {
        exam : this.props.exam,
        index : this.props.index,
        code
      }
    })
    .then(() => {
      message.success('开始执行')
      this.wait()
    })
    .catch(ex => {
      message.error(ex.error)
    })
  }

  renderLastStatus = (status) => {

    switch(status) {
      case -1 :
        return ''
      case 0 :
      case 1 :
        return '上一次提交执行中...'
      case 2 :
        return '上一次提交成功'
      case 100 :
        return '上一次提交执行超时'
      case 101 :
        return '上一次提交执行结果不正确'
    }

  }

  render(){
    const md = new MarkdownIt()

    return <div className='question'>
      <div dangerouslySetInnerHTML={{__html : md.render( this.state.question.md )}}></div>
      <textarea ref={r => this.r = r} defaultValue={this.state.question.sample}></textarea>
      <div>{this.renderLastStatus(this.state.question.last_submit_status)}</div>
      {this.state.question.correct && <div className='answer'>最优正确答案（执行时间:{this.state.question.exe_time / 1000000}ms)</div>}
      <Button style={{marginTop : 10}} onClick={this.submit}>{this.state.loading ? '执行...' : '提交'}</Button>
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

