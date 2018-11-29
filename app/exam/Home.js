import React, {Component} from 'react'

import request from '../common/util/request'
import qs from 'qs'
import Header from '../common/component/Header'
import withMe from '../common/component/withMe'



export default @withMe() class Home extends Component {

  render(){
    return <div style={{margin : '0 auto', width : '800px', padding : '40px'}}>

      <h3>考试卷</h3>
      <p>
        <a href='/exam/test'>算法能力自测卷</a>
      </p>
      <p>
        <a href='/exam/practise2'>javascript算法数据结构B模拟01</a>
      </p>
      <p>
        <a href='/exam/zfbf00001'>第一届珠峰javascript算法与数据结构考试题目</a>
      </p>

      <h3>班级</h3>
      <p>
        <a href='/my/enroll/4'>算法B-01</a>
      </p>
    </div>
  }
}