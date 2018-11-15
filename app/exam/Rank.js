import React, {Component} from 'react'
import request from '../common/util/request'

function withAlignTop(){

  return Target => {
    class WithAlignTopWrapper extends Component {

      constructor(){
        super()
        this.state = {
          top : 0
        }
      }

      handlerScroll = (e) => {
        this.setState({
          top: document.scrollingElement.scrollTop
        })
      }

      componentDidMount() {
        window.addEventListener('scroll', this.handlerScroll)
      }

      componentWillUnmount() {
        window.removeEventListener('scroll', this.handlerScroll)
      }


      render(){
        const alignStyle = {
          top : 64 - this.state.top < 0 ? 0 : 64 - this.state.top
        }
       return <Target {...this.props} alignStyle={alignStyle} />
      }

    }

    return WithAlignTopWrapper
  }

}
export default @withRank() @withAlignTop() class Rank extends Component {

  constructor(){
    super()
    this.state = {
      top : 0
    }
  }

  render() {


    return <div className='rank' style={this.props.alignStyle}>
      <h2>Ranking</h2>
      {this.props.list && this.props.list.map( (rank, i) => {
        return <div className='rank-item' key={i}>
          <div className='name'>{rank.name}<span className='score'>({rank.score ? rank.score.toFixed(2) : 0})</span></div>
          <div className='email'>{rank.email}</div>
        </div>
      })}
    </div>
  }
}


function withRank(){

  return Target => {


    class RankProxy extends Component {

      constructor() {
        super()
        this.state = {list : [], inited : false}
      }

      load(){
        request('/api/rank/top100?name=' + this.props.exam)
          .then(data => {
            this.setState({
              list : data,
              inited : true
            })
          })
      }
      componentDidMount(){
        this.load()
        this.I = setInterval( () => {
          this.load()
        }, 5000)
      }

      componentWillUnmount(){
        this.I && clearInterval(this.I)
      }



      render(){
        if(!this.state.inited) {
          return <div className='rank loading'>
            loading...
          </div>

        }
        return <Target list={this.state.list} />
      }
    }
    return RankProxy
  }
}
