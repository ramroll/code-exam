
import React, {Component} from 'react'
import MarkdownIt from 'markdown-it'
import ReactDOM from 'react-dom'
import CodeMirror from 'codemirror'
import { Button, message } from 'antd'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

import request from '../lib/request'
/**
 * 试题
 */
export default class Question extends Component{

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

    this.setState({
      loading : true
    })
    this.I = setInterval( () => {
      request(`/api/exam/paper?name=${this.props.exam}`)
        .then(paper => {
          const question = paper.questions[this.props.index]
          const state = {question }
          if(question.last_submit_status > 1) {
            clearInterval(this.I)
            state.loading = false
          }
          this.setState(state)
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

  renderLastStatus = (status, message) => {

    if(this.state.loading) {return ''}
    switch(status) {
      case -1 :
        return ''
      case 0 :
      case 1 :
        return <span>上一次提交执行中...</span>
      case 2 :
        return <span className='f-success'>上一次提交成功</span>
      case 100 :
        return <span className='f-error'>上一次提交执行超时</span>
      case 101 :
        return <span className='f-error'>上一次提交执行结果不正确</span>
      default :
        return <span className='f-error'>{message}</span>
    }

  }

  render(){
    const md = new MarkdownIt()

    return <div className='question'>
      <div dangerouslySetInnerHTML={{__html : md.render( this.state.question.md )}}></div>
      <textarea ref={r => this.r = r} defaultValue={this.state.question.sample}></textarea>
      <div>{this.renderLastStatus(this.state.question.last_submit_status,
        this.state.question.message)}</div>
      {this.state.question.correct && <div className='answer'>最优正确答案（执行时间:{this.state.question.exe_time / 1000000}ms)</div>}
      <Button style={{marginTop : 10}} onClick={this.submit}>{this.state.loading ? '执行...' : '提交'}</Button>
    </div>
  }
}
