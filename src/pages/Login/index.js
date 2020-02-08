import React, { Component } from 'react'
import LoginFrom from './chip/LoginFrom'
import './login.scss'

export default class Login extends Component {
  render() {
    return (
      <div className="wrap">
        <h3>DMS</h3>
        <LoginFrom className="login-form" />
        <p>欢迎登陆电科云-桌面管理系统</p>
      </div>
    )
  }
}
