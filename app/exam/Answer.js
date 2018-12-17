import React, {Component} from 'react'

import request from '../common/util/request'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane
import MarkdownViewer from '../common/component/MarkdownViewer'
export default class Answer extends Component{


  constructor(){
    super()

    this.state = {
      exam : null,
      activeId : null
    }
  }
  componentWillMount(){

    const name = this.props.match.params.name

    request(`/api/exam/paper?name=${name}`)
      .then(data => {
        this.setState({
          exam : data 
        }, () => {
          this.tabChange(this.state.exam.questions[0].id)
        })
      })

  }


  tabChange = (question_id) => {
    const name = this.props.match.params.name
    this.setState({
      activeId : question_id
    })

  }

  getActive = (question) => {
    return this.state.activeId == question.id
  }

  render(){
    if(!this.state.exam) {
      return '...'
    }

    const questions = this.state.exam.questions
    const defaultKey = questions[0].id

    return <div style={{
      margin: '0 auto',
      width: '900px'
    }}>
      <Tabs defaultActiveKey={defaultKey.toString()}
        onChange={this.tabChange}
      >
        {questions.map( (question, i) => {
          return <TabPane tab={question.title} key={question.id}>
            <ScrollView active={() => this.getActive(question)}>
              <AnswerList name={this.props.match.params.name}
                question_id={question.id} />
            </ScrollView>
          </TabPane>
        })}
      </Tabs>
    </div> 
  }
}

class ScrollView extends Component{
  handleScroll = (e) => {
    if(!this.props.active()) {
      return
    }
    const top = document.documentElement.scrollTop||document.body.scrollTop
    const sH = document.documentElement.scrollHeight 
    const H = document.documentElement.offsetHeight
    const diff = sH - H 

    if(this.handleScrollLock) {
      return
    }


    if(sH < H || sH < 1000) {
      return
    }
    
    if(top === diff) {
      this.handleScrollLock = true
      this.callback && this.callback()
    }
  }
  componentDidMount(){
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll)
  }


  regiseter = callback => {
    this.callback = callback
  }
  release = () => {
    this.handleScrollLock = false 
  }

  render(){
    return <div>
      {React.cloneElement(this.props.children, {
        handleEnd : this.regiseter,
        release : this.release
      })}
    </div>
  }
}

class AnswerList extends Component{

  constructor(){
    super()
    this.state = { 
      list : null,
      offset : 0,
      limit : 10
    }
  }

  handleEnd = () => {

    this.fetch().then( () => {

    })
  }

  componentDidMount(){
    this.props.handleEnd(this.handleEnd)
    this.fetch()
  }

  fetch = () => {
    return request(`/api/rank/submit/${this.props.name}/${this.props.question_id}?offset=${this.state.offset}&limit=${this.state.limit}`)
      .then(data => {
        this.state.offset += 10
        const list = this.state.list || []
        this.setState({
          list: list.concat(data) 
        }, () => {
          this.props.release()
        })
      })
  }

  toggle(submit) {

    request(`/api/exam/submit/${submit.id}/applaud`, {
      method : 'POST'
    }).then(data => {

      this.setState((prev) => {
        const list = prev.list
        submit.applauds += data.v
        return {list}
      })

    })
  }

  render(){
    if(!this.state.list) {
      return null
    }
    if(this.state.list.length === 0) {
      return <div>暂无提交</div>
    }

    return this.state.list.map((submit, i) => {
      return <AnswerCard toggle={this.toggle.bind(this, submit)} {...submit} key={i} />
    })
  }


}

const AnswerCard = ({avatar, nickname, exe_time, code, applauds, toggle}) => <div className='answer-card'>
  <div className='person'>
    <img src={avatar} />
    <span>{nickname}</span>
    <span style={{ color: 'green', marginLeft: '20px' }}>{exe_time}µs</span>
  </div>
  <MarkdownViewer md={'```\n' + code + '\n```'}></MarkdownViewer>
  <span className='like' onClick={toggle}>
    <svg viewBox='0 0 24 24' style={{ width: '12px', height: '12px' }}>
      <path d="M2 18.242c0-.326.088-.532.237-.896l7.98-13.203C10.572 3.57 11.086 3 12 3c.915 0 1.429.571 1.784 1.143l7.98 13.203c.15.364.236.57.236.896 0 1.386-.875 1.9-1.955 1.9H3.955c-1.08 0-1.955-.517-1.955-1.9z" fillule="evenodd"></path>
    </svg>
    赞同({applauds})
  </span>
</div>
