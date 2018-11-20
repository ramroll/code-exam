import React, {Component} from 'react'
import request from '../common/util/request'
import MarkdownViewer from '../common/component/MarkdownViewer'
import withMe from '../common/component/withMe'
import {Link} from 'react-router-dom'
import { Button, Popconfirm } from 'antd'

export default @withMe() @withExplains() class ExamExplains extends Component{

  renderZeroStatus(){

    return <div className='full flex-center flex-column' >
      <h1>该试卷没有解答</h1>
      <Button onClick={ () => {
        const name = this.props.match.params.name
        this.props.history.push(`/exam/${name}/explain/create`)
      }}>创建</Button>
    </div>

  }

  deleteHandler = (id) => {

    request(`/api/inspire/my/explain/${id}`, {
      method : 'DELETE'
    }).then(data => {
      window.location.reload()
    })

  }

  render() {
    if(this.props.list.length === 0) {
      return this.renderZeroStatus()
    }
    console.log(this.props.account_id)
    return <div className='explain-page'>
      {this.props.list.map( (item, i) => {
        console.log(item)

        return <div key={i}>
          {this.props.account_id === item.account_id && <div>
            <Link to={`/exam/${this.props.match.params.name}/explain/${item.id}/edit`}>编辑</Link>|<Popconfirm title='你确定要删除吗?' onConfirm={this.deleteHandler.bind(this, item.id)}><a>删除</a></Popconfirm></div>}
          <MarkdownViewer md={item.md} />
        </div>
      })}
    </div>
  }
}

function withExplains(){
  return Target => {
    class WithExplans extends Component{

      constructor(){
        super()

        this.state = {
          error : '',
          list : null
        }
      }

      componentWillMount(){
        const name = this.props.match.params.name
        request(`/api/exam/paper/${name}/explain`)
          .then(data => {
            this.setState({
              list : data
            })
          })
          .catch(ex => {
            this.setState({
              error : ex.message,
            })
          })
      }

      render(){
        if(this.state.error) {
          return <div className='full flex-center'><h1>{this.state.error}</h1></div>
        }
        if(!this.state.list) {
          return null
        }
        return <Target {...this.props} list={this.state.list} />
      }
    }

    return WithExplans

  }
}