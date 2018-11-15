import React, {Component} from 'react'
import request from '../../common/util/request'


function withQuestion() {
  return Target => {
    class QuestionProxy extends Component{


      constructor(){
        super()
        this.state = {
          list : null
        }
      }

      componentDidMount(){
        request('/api/inspire/my/questions')
          .then(list => {

            this.setState({
              list
            })
          })
      }

      render(){
        return <Target list={this.state.list} {...this.props} />
      }
    }

    return
  }

}

export default @withQuestion() class Home extends Component{
  render() {
    if(!this.props.list) {
      return <div>您还没有出过题目</div>
    }

    return <div>
    </div>
  }
}