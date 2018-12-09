import React, {Component} from 'react'

import request from '../common/util/request'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane
import MarkdownViewer from '../common/component/MarkdownViewer'
export default class Answer extends Component{


  constructor(){
    super()

    this.state = {
      list : null
    }
  }
  componentWillMount(){

    const name = this.props.match.params.name

    request(`/api/exam/paper/${name}/answer`)
      .then(data => {
        this.setState({
          list : data 
        })
      })

  }

  render(){
    if(!this.state.list) {
      return '...'
    }
    if(this.state.list.length === 0) { 
      return <div style={{
        margin: '0 auto',
        width: '900px'
      }}>
        暂无答案
      </div>
    }

    const g = {} 
    for(let i = 0; i < this.state.list.length; i++) {
      const submit = this.state.list[i]
      if(!g[submit.title]) {
        g[submit.title] = []
      }
      g[submit.title].push(submit)
    }

    const groupsKeys = Object.keys(g)
    return <div style={{
      margin: '0 auto',
      width: '900px'
    }}>
      <Tabs defaultActiveKey={groupsKeys[0]}>
        {Object.keys(g).map( (title, i) => {
          const submits = g[title]
          return <TabPane tab={title} key={title}>
            {submits.map( (x, j) => {
              return <div key={j} className='answer-card'>
                <div className='person'>
                  <img src={x.avatar} />
                  <span>{x.nickname}</span>
                  <span style={{color : 'green', marginLeft : '20px'}}>{x.exe_time}ns</span>
                </div>
                <MarkdownViewer md={'```\n' + x.code + '\n```'}></MarkdownViewer>
              </div>
            })}
          </TabPane>
        })}
      </Tabs>
    </div> 
  }
}