import React,{Component} from 'react'
import request from '../../common/util/request'
import './cls.styl'
import * as htmlToImage from 'html-to-image'
import debounce from 'debounce'




export default class Class extends Component{

  state = {
    data : null,
    kw : ''
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

  handleSearch = (kw) => {

    this.setState({kw})
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
      <Search onChange={this.handleSearch} />
      <Rank exam={name} records={list} kw={this.state.kw} />
    </div>
  }
}

const Search = ({onChange}) => {
  let _r = null
  return <div className='search'>
    <input ref={r => _r = r} onChange={debounce((e) => {
      const value = _r.value
      onChange(value)
    }, 300)} placeholder='关键字搜索' />
    <button onClick={() => {
      htmlToImage.toJpeg(document.getElementById('image-export'))
        .then(dataUrl => {
          const link = document.createElement('a')
          link.download = 'result'
          link.href = dataUrl
          link.click()
        })


    }}>保存为图片</button>
  </div>

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

const Rank = ({exam, records, kw}) => {
  records.sort((x, y) => x.exe_time - y.exe_time)

  records = records.map(x => {
    return {...x, status : x.success ? x.exe_time + '' : '未完成'}
  })

  if(kw) {

    records = records.filter(x => {
      return x.name.indexOf(kw) !== -1 ||
        x.nickname.indexOf(kw) !== -1 ||
        x.status.indexOf(kw) !== -1
    })

  }

  return <table id='image-export'>
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
          <td>{record.status === '未完成' ? <span style={{color : 'red'}}>{record.status}</span> : record.status}</td>
        </tr>
      })}

    </tbody>

  </table>
}