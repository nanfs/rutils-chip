import React, { Component } from 'react'
import LoginFrom from './chip/LoginFrom'
import loginImg from '@/assets/login-wrap-bg.png'
import './login.scss'

export default class Login extends Component {
  render() {
    return (
      <div className="wrap">
        <div className="content">
          <div className="content-left">
            <img src={loginImg} />
          </div>
          <div className="content-right">
            <div className="login-title">安全云桌面系统</div>
            <LoginFrom className="login-form" />
            <div className="company-info">
              <span className="company-logo"></span>
              <p>
                ————&nbsp;&nbsp;&nbsp;电科云（北京）有限公司&nbsp;&nbsp;&nbsp;————
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
