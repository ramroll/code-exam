import React, {Component} from 'react'

import {withFields, Field} from '../../common/component/form'

import {Input, Button, Upload, message } from 'antd'

const TextArea = Input.TextArea

import withMe from '../../common/component/withMe'

import request from '../../common/util/request'

const MeContext = withMe.Context


export default @withFields() class PersonalInfo extends Component{

  static contextType = MeContext

  submit = () => {
    const values = this.props.getFieldValues()

    request('/api/account/me', {
      method : 'POST',
      body : values
    }).then(data => {
      message.success('个人资料已更新')
    })
    .catch(ex => {
      message.error(ex.error)
    })




    console.log(values)
  }

  componentDidMount(){

    this.props.setValues({
      avatar : this.context.avatar,
      intro : this.context.intro,
      name : this.context.name,
      nickname : this.context.nickname,
      avatar : this.context.avatar
    })
  }
  render() {
    return <div className='form'>
      <h2>头像</h2>
      <Field name='avatar'>
        <ImageUpload />
      </Field>

      <h2>姓名</h2>
      <Field name='name'>
        <Input placeholder='输入题目标题' />
      </Field>
      <h2>昵称</h2>
      <Field name='nickname'>
        <Input placeholder='输入您的昵称' />
      </Field>

      <h2>个人介绍(100字以内)</h2>
      <Field name='intro'>

        <TextArea placeholder='请填写个人介绍' />
      </Field>

      <Button style={{ marginTop: 20 }} onClick={this.submit} type='primary'>
        保存
        </Button>
    </div>


  }
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  const isPNG= file.type === 'image/png';
  if (!isJPG && !isPNG) {
    message.error('只支持jpeg/png格式的头像');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('图片不能超过1MB!');
  }
  return (isJPG || isPNG) && isLt2M;
}

class ImageUpload extends Component{

  constructor(){
    super()
    this.state = {
      loading : false,
      image : null
    }
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.state.image) {
      this.setState({
        image : nextProps.value
      })
    }
  }
  renderImage(){

    if(this.state.loading) {
      return <span>...</span>
    }
    if(this.state.image) {
      return <img className='avatar' src={this.state.image} />
    }

    return '+'
  }
  render(){
    return <Upload
      fileList={this.state.filelist}
      customRequest={(file) => {
        const form = new FormData()
        form.append('filefield',file.file)
        this.setState({
          loading : true
        })
        return fetch('/api/inspire/upload/avatar', {
          method : "POST",
          headers : {
            TOKEN : localStorage['XTOKEN']
          },
          body : form
        })
        .then(data => {
          return data.json()
        })
        .then(json => {
          this.setState({
            image : json.file,
            loading : false
          }, () => {
            this.props.onChange && this.props.onChange(json.file)
          })
        })
        .catch(ex=>{
          message.error(ex.error)
          this.setState({
            loading: false
          })
        })
      }}
      listType='picture-card'
      beforeUpload={beforeUpload}
      showUploadList={false}
      onChange={this.changeHandler}>{this.renderImage()}</Upload>
  }

}