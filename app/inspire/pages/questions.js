import React, {Component} from 'react'
import request from '../../common/util/request'
import { Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'

function withQuestion() {
  return Target => {
    class QuestionProxy extends Component{


      constructor(){
        super()
        this.state = {
          list : null
        }
      }

      componentDidMount(){

        request('/api/inspire/my/question')
          .then(list => {

            this.setState({
              list
            })
          })
      }

      remove = (id) => {
        this.setState({
          list : this.state.list.filter(x => x.id !== id)
        })
      }

      render(){
        return <Target
          remove={this.remove}
          list={this.state.list} {...this.props} />
      }
    }

    return QuestionProxy
  }

}

export default @withQuestion() class Home extends Component{

  handleDelete = (id) => {

    request('/api/inspire/my/question', {
      method : 'DELETE',
      body : {
        id
      }
    }).then(result => {
      debugger
      this.props.remove(id)
    })
  }
  render() {

    if(!this.props.list) {
      return <div className='zero-status'>
        加载中...
      </div>
    }
    if(this.props.list.length === 0) {
      return <div className='zero-status'>
        您还没有出过题目
        <div><Button type='primary' color='info'><Link to='/inspire/question'>出题</Link></Button></div>
      </div>
    }

    return <div>
      <table className='table-with-actions'>

        <thead>
          <tr>
            <td>题目编号</td>
            <td>题目标题</td>
            <td>操作</td>
          </tr>
        </thead>


        <tbody>
          {this.props.list.map( (item, i) => {
            return <tr key={i}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td><Link to={`/inspire/question/${item.id}`}>编辑</Link>|<Popconfirm title='删除后将不能回复？' onConfirm={this.handleDelete.bind(this, item.id)}><a style={{color : 'red'}}>删除</a></Popconfirm></td>

            </tr>
          })}
        </tbody>


      </table>

    </div>

  }
}