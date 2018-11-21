import React, {Component} from 'react'

import {withFields, Field} from '../../common/component/form'

import {Input, Button, Upload} from 'antd'

export default @withFields() class PersonalInfo extends Component{
  render() {
    return <div className='form'>
      <h2>姓名</h2>
      <Field name='title'>
        <Input placeholder='输入题目标题' />
      </Field>
      <h2>昵称</h2>
      <Field name='title'>
        <Input placeholder='输入题目标题' />
      </Field>
      <h2>头像</h2>
      <Field name='title'>
        <ImageUpload />
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
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class ImageUpload extends Component{

  constructor(){
    super()
    this.state = {
      loading : false
    }
  }

  changeHandler = (info) => {

    if(info.file.status === 'uploading') {
      this.setState({
        loading : true
      })
      return
    }

    if(info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        debugger
        this.setState({
          loading: false,
        })
      })
    }

  }
  render(){
    return <Upload
      action='/api/inspire/upload/avatar'
      onChange={this.changeHandler}>+</Upload>
  }

}