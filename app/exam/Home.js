import React, {Component} from 'react'

import request from '../common/util/request'
import qs from 'qs'
import Header from '../common/component/Header'
import withMe from '../common/component/withMe'



export default @withMe() class Home extends Component {

  render(){
    return <div style={{margin : '0 auto', width : '800px', padding : '40px'}}>

      <h2>考试卷</h2>
      <p>
        <a href='/exam/test'>算法能力自测卷</a>
      </p>

      <p>
        <a href='/exam/practise2'>javascript算法数据结构B模拟01</a>
      </p>

      <h2 style={{marginTop : '20px'}}>
        珠峰合作课程：javascript算法和数据结构
        <a href='http://www.zhufengpeixun.cn/' areaLabel='weavinghorse' target="_blank">
          <img style={{ width: '100px' }} src={require('../../static/img/zf.jpg')} alt="珠峰首页" />
        </a>
      </h2>

      <div className="block" style={{
        border : '1px solid #eee',
        padding : '10px'
      }}>
        <p>
          <a href='https://ke.qq.com/course/323156' target="_black">视频课程链接</a>
        </p>
        <p>
          <a href='/my/enroll/4'>班级：珠峰javascript算法数据结构-B01</a>
        </p>
        <p>
          <a href='/exam/zfb00001'>第一届珠峰javascript算法与数据结构考试题目</a>
        </p>
        <p>
          <a href='/exam/basic01'>第一周练习</a>
        </p>
        <p>
          <a href='/exam/basic02'>第二周练习</a>
        </p>
        <p>
          <a href='/exam/basic03'>第三周练习</a>
        </p>
        <p>
          <a href='/exam/basic04'>第四周练习</a>
        </p>
        <p>
          <a href='/exam/basic05'>第五周练习</a>
        </p>
        <p>
          <a href='/exam/basic06'>第六周练习</a>
        </p>
      </div>

      <h2 style={{marginTop : '20px'}}>
        函数式编程专题
      </h2>
      <div className="block" style={{
        border : '1px solid #eee',
        padding : '10px'
      }}>
        <p>
          <a href='/exam/fp01'>函数式编程训练1</a>
        </p>
      </div>

    </div>

  }
}