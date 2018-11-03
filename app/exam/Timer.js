import React, {Component} from 'react'
import left_time from '../lib/left_time'

export default class Timer extends Component{

  constructor(props){
    super()
    this.state = {
      left : props.left
    }
  }
  componentWillMount(){
    let t = new Date().getTime()
    this.I = setInterval( () => {
      const d = new Date().getTime() - t
      const left = this.props.left - d
      if(left > 0) {
        this.setState({
          left
        })
      } else {
        this.setState({
          left : 0
        })
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.I)
  }

  render(){
    if(!this.state.left) {
      return <span>已结束</span>
    }

    return <span className='timer'>{left_time(this.state.left)}</span>
  }
}


