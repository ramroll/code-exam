import MarkdownIt from 'markdown-it'
import React, {Component} from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'


export default class MarkdownViewer extends Component{

  constructor(){
    super()
  }

  render(){
    const md = new MarkdownIt()
    return <div className='markdown-viewer'>
      <div className='md' dangerouslySetInnerHTML={{ __html: md.render(this.props.md) }}></div>
    </div>
  }
}