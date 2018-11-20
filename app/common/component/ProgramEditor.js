import React, {Component} from 'react'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import CodeMirror from 'codemirror'

export default class ProgramEditor extends Component{

  constructor(props){
    super()
    this.state = {
      value : props.value
    }
  }

  componentDidMount(){
    const node = ReactDOM.findDOMNode(this.r)
    this.cm = CodeMirror.fromTextArea(node, {
      mode: 'javascript'
    })
    this.cm.on('change', this.changeHandler)
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.value !== nextProps.value) {
      this.cm.setValue(nextProps.value)
      this.setState({
        value : nextProps.value
      })
    }
  }

  changeHandler = (e) => {
    const value = this.cm.getValue()
    this.state.value = value
    this.props.onChange && this.props.onChange(value)
  }


  render(){
    return <textarea
      value={this.state.value}
      ref={r => this.r = r}></textarea>
  }
}