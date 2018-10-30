import React, { Component } from 'react'
import MarkdownIt from 'markdown-it'
import ReactDOM from 'react-dom'

import { Button } from 'antd'


@withExam()
export default class Exam extends Component {
  render() {
    return <div className='paper'>
      <h1>{this.props.title}</h1>
      {this.props.questions.map( (question, i) => {
        return <Question {...question} key={i} index={i} />
      })}
    </div>
  }
}


class Question extends Component{

  componentDidMount(){
    const domNode = ReactDOM.findDOMNode(this.r)
    CodeMirror.fromTextArea(domNode, {
      mode : 'javascript'
    })
  }
  render(){
    const md = new MarkdownIt()
    return <div className='question'>
      <div dangerouslySetInnerHTML={{__html : md.render( this.props.md )}}></div>
      <textarea ref={r => this.r = r} defaultValue={this.props.sample}></textarea>
      <Button>提交</Button>
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
          exam : null
        }
      }

      componentWillMount() {

        fetch('/api/exam/paper?name=' + this.name)
          .then(resp => {
            return resp.json()
          })
          .then(jsonData => {
            this.setState({exam : jsonData})
          })


      }

      render() {
        if(!this.state.exam) {
          return <p>Loading...</p>
        }
        return <Target {...this.state.exam} />
      }
    }

    return ExamProxy

  }
}
