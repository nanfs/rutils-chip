import React, { Component } from 'react'
import LoginFrom from './chip/LoginFrom'
import './login.less'

export default class Login extends Component {
  render() {
    return (
      <div className="wrap">
        <div className="header"></div>
        <div className="content">
          <div className="content-left">
            <div className=" animate-logo animate-logo1"></div>
            <div className="animate-logo animate-logo2"></div>
            <div className="animate-logo animate-logo3"></div>
            <div className="animate-div animate-div1"></div>
            <div className="animate-div animate-div2"></div>
            <div className="animate-div animate-div3"></div>
          </div>
          <div className="content-right">
            <div className="login-title">安全云桌面管理系统</div>
            <LoginFrom className="login-form" />
          </div>
        </div>
        <div className="footer">
          <p>电科云（北京）科技有限公司</p>
        </div>
      </div>
    )
  }
}
