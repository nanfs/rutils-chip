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
            <div className="login-title">
              <h3>安全云桌面管理系统</h3>
              <span>版本 1.1.2</span>
            </div>
            <div className="sub-title">
              <span className="welcome">welcome</span>
              <span className="text">欢迎使用安全云桌面管理系统</span>
            </div>
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
