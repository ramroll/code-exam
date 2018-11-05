import React, { Component } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import request from "../lib/request";
import { tract_register } from "../lib/tract";
const FormItem = Form.Item;
export default class Register extends Component {
  render() {
    return (
      <div className="flex-center full">
        <div className="login">
          <h1>注册</h1>
          <WrappedNormalLoginForm />
        </div>
      </div>
    );
  }
}

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password !== values.retype) {
          message.error("两次密码不一致");
          return;
        }

        delete values.retype;
        tract_register();
        request("/api/account/register", {
          method: "POST",
          body: values
        })
          .then(() => {
            message.success("注册成功，邮件已发送至您的邮箱");
            window.location = "/regsucc";
          })
          .catch(({ error }) => {
            message.error(error);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("email", {
            rules: [
              { required: true, message: "请输入邮箱!" },
              {
                type: "email",
                message: "邮箱格式不正确"
              }
            ]
          })(<Input placeholder="邮箱" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码!" }]
          })(<Input type="password" placeholder="密码" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("retype", {
            rules: [{ required: true, message: "请再次输入密码!" }]
          })(<Input type="password" placeholder="重复输入密码" />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "请输入真实姓名!" }]
          })(<Input placeholder="请输入真实姓名" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("nickname", {
            rules: [{ required: true, message: "请输入昵称!" }]
          })(<Input placeholder="昵称" />)}
        </FormItem>

        <FormItem>
          <div>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              注册账号
            </Button>
          </div>

          <div>
            <a href="/login">登录</a>
          </div>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
