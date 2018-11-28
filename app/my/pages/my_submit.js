import React, {Component} from 'react'
import request from '../../common/util/request'
import { Button, Popconfirm, message } from 'antd'
import { Link } from 'react-router-dom'

function withClass() {
  return Target => {
    class PaperProxy extends Component{


      constructor(){
        super()
        this.state = {
          list : null
        }
      }

      componentDidMount(){

        request('/api/school/my/class')
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

export default @withClass() class Papers extends Component{

  handleDelete = (id) => {

    request('/api/school/my/class', {
      method : 'DELETE',
      body : {
        id
      }
    }).then(result => {
      this.props.remove(id)
    }).catch(ex => {
      message.error(ex.error)
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
        您没有需要管理的班级
        <div><Button type='primary' color='info'><Link to='/inspire/my/class/create'>成立一个</Link></Button></div>
      </div>
    }

    return <div>
      <table className='table-with-actions'>

        <thead>
          <tr>
            <td>学员</td>
            <td></td>
            <td>操作</td>
          </tr>
        </thead>


        <tbody>
          {this.props.list.map( (item, i) => {
            return <tr key={i}>
              <td>{item.name}</td>
              <td>{item.priv}</td>
              <td>
                <Link to={`/inspire/my/class/${item.id}/edit`}>通过</Link>
                |
                <Link to={`/inspire/my/class/${item.id}/students`}>学员管理</Link>
                |
                <a onClick={() => {
                  const input = document.createElement('input')
                  document.body.appendChild(input)
                  input.setAttribute('value', 'hhh')
                  input.select()
                  document.execCommand('copy')
                  message.success('分享链接已经拷贝到剪贴板')
                  document.body.removeChild(input)
                }}>分享</a>
                |
                <Popconfirm title='删除后将不能恢复？' onConfirm={this.handleDelete.bind(this, item.id)}><a style={{color : 'red'}}>删除</a></Popconfirm></td>
            </tr>
          })}
        </tbody>


      </table>

    </div>

  }
}