import React, { Component } from 'react'
import LoginFrom from './chip/LoginFrom'
import './login.less'

export default class Login extends Component {
  render() {
    return (
      <div className="login-wrap">
        <div className="header"></div>
        <div className="content">
          <div className="content-left">
            <div className="animate jiqun"></div>
            <div className="animate animate3"></div>
            <div className="animate animate4"></div>
            <div className="animate-div animate-div1"></div>
            <div className="animate-div animate-div2"></div>
          </div>
          <div className="content-right">
            <div className="login-title">
              <h3>安全云桌面管理系统</h3>
            </div>
            <LoginFrom className="login-form" />
            <div className="version">
              <span>V1.0.0 build 3561</span>
            </div>
          </div>
        </div>
        <div className="footer">
          <p>电科云（北京）科技有限公司</p>
        </div>
      </div>
    )
  }
}
