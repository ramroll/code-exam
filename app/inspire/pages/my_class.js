import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Button, message, Input, InputNumber } from 'antd'
import request from '../../common/util/request'
import {withFields, Field} from '../../common/component/form'


export default @withFields() class WritePaper extends Component{

  constructor(){
    super()

    this.state = {
      questionList : []
    }
  }

  componentDidMount() {

    const id = this.props.match.params.id
    if(id) {
      request(`/api/school/my/class/${id}`)
        .then(question => {
          this.props.setValues(question)
        })
    } else {
      this.props.setValues({
      })

    }
  }

  submit = () => {

    const values = this.props.getFieldValues()
    request('/api/school/my/class', {
      method: values.id ? 'PUT' : 'POST',
      body: values
    })
    .then(data => {
      message.success('操作成功')
      this.props.history.push('/inspire/my/classes')
    })
    .catch(ex => {
      message.error(ex.error)
    })
    console.log(values)


  }


  render(){

    return <div className='form'>
      <Field name='id' />

      <h2>班级名称</h2>
      <Field name='name'>
        <Input  placeholder='请输入班级名称' />
      </Field>

      <h2>班级介绍</h2>
      <Field name='intro'>
        <Input.TextArea  placeholder='请输入班级介绍' />
      </Field>

      <Field name='managers'>
        <Managers />
      </Field>

      <Button style={{ marginTop: 20 }} onClick={this.submit} type='primary'>
        保存
      </Button>
    </div>

  }

}

class Managers extends Component{

  constructor(props){
    super()
    this.state = {
      list : props.list || []
    }
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.state.list) {
      this.setState({
        list : nextProps.value
      })
    }
  }
  addItem = () => {
    this.setState({
      list : [...this.state.list, {
      }]
    })
  }

  changeHandler = (i, values) => {
    this.state.list[i] = values
    this.props.onChange && this.props.onChange(this.state.list)
  }

  deleteHandler = (i) => {

    this.setState({
      list : this.state.list.filter((x, j) => j !== i)
    })
  }

  render(){
    return <div>
      <table className='subform-list'>
        <thead>
        <tr>
          <td>邮箱</td>
          <td></td>
        </tr>
        </thead>
        <tbody>
        {
          this.state.list.map((question, i) => {
            return <Manager
              delete={this.deleteHandler.bind(this, i)}
              onChange={this.changeHandler.bind(this, i)}
              defaultValues={question}
              save={this.saveQuestion} key={i} />
          })
        }
        </tbody>
      </table>
      <a onClick={this.addItem}>+增加管理人员</a>
    </div>
  }
}

@withFields()
class Manager extends Component{
  render(){

    return <tr>
      <td>
        <Field name='email' >
          <Input type='email' placeholder='管理人员邮箱' />
        </Field>
      </td>
      <td>
        <Button type='danger' onClick={this.props.delete}>删除</Button>
      </td>

    </tr>

  }
}