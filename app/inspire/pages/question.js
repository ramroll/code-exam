import React, {Component} from 'react'

import ReactDOM from 'react-dom'
import { Button, message, Input } from 'antd'
import request from '../../common/util/request'
import {Field, withFields} from '../../common/component/form'

import ProgramEditor from '../../common/component/ProgramEditor'
import MarkdownEditor from '../../common/component/MarkdownEditor'

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


