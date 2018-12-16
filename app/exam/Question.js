
import React, {Component} from 'react'
import MarkdownIt from 'markdown-it'
import ReactDOM from 'react-dom'
import CodeMirror from 'codemirror'
import { Button, message, Tabs } from 'antd'
const TabPane = Tabs.TabPane
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import request from '../common/util/request'
import {tract_submit, tract_view_paper} from '../common/util/tract'

/**
 * 试题
 */
export default class Question extends Component{

  constructor(props){
    super()

    this.state = {
      tab : 'question',
      question : props.question,
      timeout : false
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
      loading : true,
      timeout : false
    })

    this.I = setInterval( () => {
      request(`/api/exam/paper?name=${this.props.exam}`)
        .then(paper => {
          const question = paper.questions[this.props.index]
          const state = {question }
          if(question.last_submit_status > 1) {
            clearInterval(this.I)
            state.loading = false
            state.timeout = false
            this.T && clearTimeout(this.T)
          }
          console.log('result', paper)
          this.setState(state)
        })
    }, 2000)


  }

  componentWillUnmount(){
    this.I && clearInterval(this.I)
  }

  submit = () => {
    const code = this.cm.getValue()
    if(this.state.loading) {
      message.warning('正在执行,请稍后')
      return
    }

    tract_submit(this.props.exam, this.props.index)
    request('/api/exam/submit', {
      method : 'POST',
      body : {
        exam : this.props.exam,
        question_id: this.props.question.id,
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
    // this.T = setTimeout(() => {
    //   clearTimeout(this.I)
    //   this.setState({
    //     loading: false,
    //     timeout : true
    //   })
    // }, 10000)
  }

  renderLastStatus = (status, message) => {

    if(this.state.loading) {return ''}
    // if(this.state.timeout) {
    //   return <span>上一次提交（系统繁忙）请重试</span>
    // }
    switch(status) {
    case -1 :
      return ''
    case 0 :
    case 1 :
      return <span>上一次提交执行中...</span>
    case 2 :
      return <span className='f-success'>上一次提交成功</span>
    case 100 :
      return <span className='f-error'>执行超时</span>
    case 101 :
      return <span className='f-error'>错误：{message}</span>
    default :
      return <span className='f-error'>执行错误:{message}</span>
    }

  }

  render(){
    const md = new MarkdownIt()

    return <div className='question'>
      <Tabs defaultActiveKey='1' onChange={this._change_tab}>
        <TabPane tab='题目' key='1'>
          <h3>题目{this.props.index + 1}:{this.state.question.title}</h3>
          <div className='md' dangerouslySetInnerHTML={{ __html: md.render(this.state.question.md) }}></div>
          <textarea ref={r => this.r = r} defaultValue={this.state.question.sample}></textarea>
          <div>{this.renderLastStatus(this.state.question.last_submit_status,
            this.state.question.message)}</div>
          {this.state.question.correct && <div className='answer'>最优正确答案（执行时间:{format(this.state.question.exe_time)}ns)</div>}
          <Button style={{ marginTop: 10 }} onClick={this.submit}>{this.state.loading ? '执行...' : '提交'}</Button>
        </TabPane>
        <TabPane tab='控制台' key="2">
          <div className='console'>
            {this.state.question.console}
          </div>
        </TabPane>
      </Tabs>
    </div>
  }
}

function format(n){
  n = n.toString()
  return [...[...n].reverse().join('').replace(/(\d{3})/g, '$&,')].reverse().join('')
}
