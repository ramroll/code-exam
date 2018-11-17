import React, {Component} from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import CodeMirror from 'codemirror'
import ReactDOM from 'react-dom'
import { Button, message, Input } from 'antd'
import request from '../../common/util/request'
import {Field, withFields} from '../../common/component/form'

const default_tester = `function tester(testutil, code){
  eval(code)
  if(typeof {your-function-name} !== 'function') {
    testutil.undef('函数未定义')
  }
}

module.exports = tester
`



export default @withFields() class WriteQuestion extends Component{

  componentDidMount() {

    const id = this.props.match.params.id
    if(id) {
      request(`/api/inspire/my/question/${id}`)
        .then(question => {
          this.props.setValues(question)
        })

    } else {
      this.props.setValues({
        md: '题目正文',
        sample: 'function foo() {\n /// TODO \n}',
        tester: default_tester
      })

    }
  }

  submit = () => {

    const values = this.props.getFieldValues()

    request('/api/inspire/my/question', {
      method : values.id ? 'PUT' : 'POST',
      body : values
    })
    .then(result => {
      message.success(this.props.match.params.id ? '保存成功' : '创建成功')
      this.props.history.replace('/inspire/questions')
    })
    .catch(ex=> {
      message.error(ex.error)
    })

  }


  render(){

    return <div className='form'>
      <h2>题目标题</h2>
      <Field name='title'>
        <Input  placeholder='输入题目标题' />
      </Field>
      <h2>题目描述(Markdown语法)</h2>
      <Field name='md'>
        <MarkdownEditor />
      </Field>
      <h2>示例程序</h2>

      <Field name='sample'>
        <ProgramEditor />
      </Field>
      <h2>测试程序</h2>

      <Field name='tester'>
        <ProgramEditor />
      </Field>

      <Button style={{ marginTop: 20 }} onClick={this.submit} type='primary'>
        {this.props.match.params.id ? '保存' : '创建'}
      </Button>
    </div>

  }

}

class MarkdownEditor extends Component{

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

class ProgramEditor extends Component{

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