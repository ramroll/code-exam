import React, {Component} from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import CodeMirror from 'codemirror'
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
      request(`/api/inspire/my/paper/${id}`)
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


    request('/api/inspire/my/paper', {
      method: values.id ? 'PUT' : 'POST',
      body: values
    })
    .then(data => {
      message.success('操作成功')
    })
    .catch(ex => {
      message.error(ex.error)
    })
    console.log(values)


  }


  render(){

    return <div className='form'>
      <Field name='id' />

      <h2>试卷标题</h2>
      <Field name='title'>
        <Input  placeholder='输入试卷标题' />
      </Field>

      <h2>试卷名称(小写英文字母开头的字母/数字和-)</h2>
      <Field name='name'>
        <Input  placeholder='输入试卷名称' />
      </Field>


      <h2>考试时间(秒)</h2>
      <Field name='time'>
        <Input placeholder='输入考试时间' />
      </Field>


      <h2>题目清单</h2>
      <Field name='list'>
        <QuestionList />
      </Field>


      <Button style={{ marginTop: 20 }} onClick={this.submit} type='primary'>
        保存
      </Button>
    </div>

  }

}


class QuestionList extends Component{

  constructor(props){
    super()

    this.state = {
      list : props.list || []
    }

  }


  addQuestion = () => {
    this.setState({
      list : [...this.state.list, {
        min_score : 50,
        weight : 20
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
      <table className='question-list'>
        <tr>
          <td>题目编号</td>
          <td>最低分</td>
          <td>参考时间</td>
          <td>权重</td>
          <td></td>
        </tr>
        {
          this.state.list.map((question, i) => {
            return <Question
              delete={this.deleteHandler.bind(this, i)}
              onChange={this.changeHandler.bind(this, i)}
              defaultVaues={question} save={this.saveQuestion} key={i} />
          })
        }
      </table>
      <a onClick={this.addQuestion}>+增加题目</a>
    </div>
  }
}

@withFields()
class Question extends Component{
  render(){

    return <tr>
      <td>
        <Field name='question_id' >
          <Input type='number' placeholder='题目编号' />
        </Field>
      </td>
      <td>
        <Field name='min_score'>
          <Input type='number' min='0' max='100' placeholder='最低得分' />
        </Field>
      </td>
      <td>
        <Field name='ref_time'>
          <Input type='number' min='0' placeholder='参考时间(纳秒)' />
        </Field>
      </td>
      <td>
        <Field name='weight'>
          <Input type='number' min='1' max='100' placeholder='权重' />
        </Field>
      </td>
      <td>
        <Button type='danger' onClick={this.props.delete}>删除</Button>
      </td>

    </tr>

  }
}