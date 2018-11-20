import React, {Component} from 'react'

import {withFields, Field} from '../common/component/form'
import {Button, message} from 'antd'

// import ProgramEditor from '../common/component/ProgramEditor'
import MarkdownEditor from '../common/component/MarkdownEditor'
import request from '../common/util/request'

export default @withFields() class ExplainEdit extends Component{

  componentWillMount(){

    request(`/api/exam/paper/${this.props.match.params.name}/explain/${this.props.match.params.id}`)
      .then(data => {
        this.props.setValues({
          md : data.md
        })
      })


  }

  submit = () => {
    const values = this.props.getFieldValues()
    values.name = this.props.match.params.name
    if(this.props.match.params.id) {
      values.id = this.props.match.params.id
    }
    request(`/api/inspire/my/explain`, {
      method: 'POST',
      body : values
    }).then(data => {
      message.success('操作成功')
      this.props.history.push(`/exam/${this.props.match.params.name}/explain`)
    }).catch(ex =>  {

      message.error(ex.message)
    })




  }
  render(){
    return <div className='explain-page'>
      <h2>考试解答</h2>
      <Field name='md'>
        <MarkdownEditor />
      </Field>
      <Button onClick={this.submit}>{this.props.match.params.id ? '保存' : '创建'}</Button>
    </div>
  }
}