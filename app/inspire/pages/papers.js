import React, {Component} from 'react'
import request from '../../common/util/request'
import { Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'

function withPaper() {
  return Target => {
    class PaperProxy extends Component{


      constructor(){
        super()
        this.state = {
          list : null
        }
      }

      componentDidMount(){

        request('/api/inspire/my/paper')
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

    return PaperProxy
  }

}

export default @withPaper() class Papers extends Component{

  handleDelete = (id) => {

    request('/api/inspire/my/paper', {
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
        您还没有出过试卷
        <div><Button type='primary' color='info'><Link to='/inspire/paper'>出试卷</Link></Button></div>
      </div>
    }

    return <div>
      <table className='table-with-actions'>

        <thead>
          <tr>
            <td>试卷编号</td>
            <td>名称</td>
            <td>标题</td>
            <td>操作</td>
          </tr>
        </thead>


        <tbody>
          {this.props.list.map(item => {
            return <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.title}</td>
              <td><Link to={`/inspire/paper/${item.id}`}><a>编辑</a></Link>|<Popconfirm title='删除后将不能回复？' onConfirm={this.handleDelete.bind(this, item.id)}><a style={{color : 'red'}}>删除</a></Popconfirm></td>

            </tr>
          })}
        </tbody>


      </table>

    </div>

  }
}