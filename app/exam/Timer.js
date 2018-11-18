import React, {Component} from 'react'
import left_time from '../common/util/left_time'

export default class Timer extends Component{

  constructor(props){
    super()
    this.state = {
      time : props.tillstart > 0 ? props.tillstart : props.left
    }
  }
  componentWillMount(){
    let t = new Date().getTime()
    this.I = setInterval( () => {
      const d = new Date().getTime() - t
      const left = (this.props.tillstart > 0 ? this.props.tillstart : this.props.left ) - d
      if(left > 0) {
        this.setState({
          time : left 
        })
      } else {
        this.setState({
          time : 0
        })
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.I)
  }

  render(){
    if (this.props.tillstart > 0) {
      return <span className='timer'>距离考试开始：{left_time(this.state.time)}</span>
    }
    
    if (this.props.permanent) {
      return <span>直到永远</span>
    }
   
    if(this.state.time <= 0) {
      return <span>已结束</span>
    }

    return <span className='timer'>距离考试结束：{left_time(this.state.time)}</span>
  }
}


