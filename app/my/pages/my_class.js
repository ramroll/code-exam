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

        request('/api/my/class')
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
  renderStatus(status) {

    switch(status) {
      case 'verified' :
        return '通过'
      case 'apply' :
        return '等待审核'
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
        您还没有参加任何班级
      </div>
    }



    return <div>
      <table className='table-with-actions'>

        <thead>
          <tr>
            <td>班级名称</td>
            <td>状态</td>
            <td>学员数量</td>
          </tr>
        </thead>


        <tbody>
          {this.props.list.map( (item, i) => {
            return <tr key={i}>
              <td>{item.class_name}</td>
              <td>{this.renderStatus(item.status)}</td>
              <td><a href={`/my/enroll/${item.id}`}>{item.total}</a></td>
            </tr>
          })}
        </tbody>


      </table>

    </div>

  }
}