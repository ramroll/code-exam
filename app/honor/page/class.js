import React,{Component} from 'react'
import request from '../../common/util/request'
import './cls.styl'

export default class Class extends Component{

  state = {
    data : null
  }
  componentWillMount(){
    const id = this.props.match.params.id
    const exam = this.props.match.params.exam

    let url = `/api/rank/class/${id}/stat`
    if (exam) {
      url += '/' + exam
    }
    request(url)
      .then(data => {
        this.setState({
          data
        })

      })
  }

  handleTabClick = tab => {
    const id = this.props.match.params.id
    this.props.history.push(`/honor/class/${id}/${tab}`)
  }

  render(){
    if(!this.state.data) {
      return null
    }

    const {name, list} = this.state.data.exam
    return <div>
      <h1>{this.state.data.info.name}</h1>
      <h2 className='subtitle'>{this.state.data.info.intro}</h2>
      <Tabs tabs={this.state.data.info.exams} active={name} onClick={this.handleTabClick} />
      <Rank exam={name} records={list} />
    </div>
  }
}

const Tabs = ({tabs, active, onClick}) => {
  return <h2 className='block-title'>{
    tabs.map( (tab, i) =>
      <React.Fragment key={tab}>
        <span
          className={active === tab ? 'active' : ''}
          onClick={() => onClick(tab)} key={tab}>{tab}</span>
        {i !== tabs.length - 1 &&  <span>/</span>}
      </React.Fragment>
    )
  }
  </h2>

}

const Rank = ({exam, records}) => {
  records.sort((x, y) => x.exe_time - y.exe_time)

  return <table>
    <thead>
      <tr>
        <td>头像</td>
        <td>姓名</td>
        <td>昵称</td>
        <td>完成情况</td>
      </tr>

    </thead>

    <tbody>
      {records.map((record, i) => {
        return <tr key={i}>
          <td><img src={record.avatar} /></td>
          <td>{record.name}</td>
          <td>{record.nickname}</td>
          <td>{record.success ? record.exe_time : '未完成'}</td>
        </tr>
      })}

    </tbody>

  </table>
}