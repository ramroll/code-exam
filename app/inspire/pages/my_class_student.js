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

        request('/api/school/my/student')
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

  renderStatus(item) {

    function verify(id) {
      return () => {
        request(`/api/school/my/class/student/${id}/verify`, {
          method : 'POST'
        })
        .then(data => {
          // message.success('已通过')
          item.status = 'verified'
          this.forceUpdate()
        })
        .catch(ex => {
          console.log(ex)
          message.error(ex.error)
        })
      }
    }

    verify = verify.bind(this)
    if(item.status === 'apply') {
      return <Button onClick={verify(item.id)}>通过</Button>
    }
    else if(item.status === 'verified') {
      return '已通过'
    }
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
            <td></td>
            <td>学员</td>
            <td>邮箱</td>
            <td>审核状态</td>
          </tr>
        </thead>


        <tbody>
          {this.props.list.map( (item, i) => {
            return <tr key={i}>
              <td>{item.avatar}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{this.renderStatus(item)}</td>
            </tr>
          })}
        </tbody>


      </table>

    </div>

  }
}