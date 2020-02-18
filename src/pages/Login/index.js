import React, { Component } from 'react'
import LoginFrom from './chip/LoginFrom'
import './login.scss'
import { setUserToLocal } from '@/components/Authorized'

export default class Login extends Component {
  onSuccess = username => {
    setUserToLocal(username)
    this.props.history.push('/')
  }

  render() {
    return (
      <div className="wrap">
        <div className="content">
          <div className="content-left"></div>
          <div className="content-right">
            <div className="login-title">安全云桌面管理系统</div>
            <LoginFrom className="login-form" onSuccess={this.onSuccess} />
            <div className="company-info">
              <span className="company-logo"></span>
              <p>
                ————————————&nbsp;&nbsp;&nbsp;电科云（北京）有限公司&nbsp;&nbsp;&nbsp;————————————
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
