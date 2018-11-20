import React, {Component} from 'react'


export default class MarkdownEditor extends Component{

  constructor(props){
    super()
    this.state = {
      value : props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.value !== nextProps.value) {
      this.setState({
        value : nextProps.value
      })
    }
  }

  changeHandler = (e) => {
    this.props.onChange && this.props.onChange(e.target.value)
  }

  render(){
    return <textarea
      className='markdown-editor'
      onChange={this.changeHandler}
      value={this.state.value}
    />
  }
}
