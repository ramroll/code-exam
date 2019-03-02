import React,{Component} from 'react'
import request from '../../common/util/request'
import './cls.styl'

export default class Class extends Component{

  state = {
    data : null
  }
  componentWillMount(){
    const id = this.props.match.params.id
    request(`/api/rank/class/${id}/stat`)
      .then(data => {
        this.setState({
          data
        })

      })
  }

  render(){
    if(!this.state.data) {
      return null
    }

    const list = Object.keys(this.state.data).map(key => {
      return {exam : key, submits : this.state.data[key]}
    })
    return <div>
      {list.map( ({exam, submits}) => {

        return <div key={exam}>
          <h2 className='title'>{exam}</h2>
          <Rank exam={exam} records={submits} />
        </div>
      })}
    </div>
  }
}

const Rank = ({exam, records}) => {
  records.sort((x, y) => x.exe_time - y.exe_time)

  return <table>
    <thead>
      <tr>
        <td>姓名</td>
        <td>昵称</td>
        <td>完成情况</td>
      </tr>

    </thead>

    <tbody>
      {records.map((record, i) => {
        return <tr key={i}>
          <td>{record.name}</td>
          <td>{record.nickname}</td>
          <td>{record.success ? record.exe_time : '未完成'}</td>
        </tr>
      })}

    </tbody>

  </table>
}