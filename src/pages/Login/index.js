import React, { Component } from 'react'
import LoginFrom from './chip/LoginFrom'
import './login.less'

export default class Login extends Component {
  componentDidMount() {
    this.setContentBg()
    window.addEventListener('resize', this.setContentBg)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setContentBg)
  }

  setContentBg = () => {
    const width = document.querySelector('.wrap').offsetWidth
    const contentWidth = document.querySelector('.content').offsetWidth
    document.querySelector('.content').style.backgroundPositionX = `-${(width -
      contentWidth) /
      2}px`
  }

  render() {
    return (
      <div className="wrap">
        <div className="content">
          <div className="content-left">
            <span className="login-logo"></span>
            <span className="login-logoinfo">电科云</span>
          </div>
          <div className="content-right">
            <div className="login-title">安全云桌面管理系统</div>
            <LoginFrom className="login-form" />
            <div className="company-info">
              <span className="company-logo"></span>
              <p>
                <span className="login-line line-left"></span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电科云（北京）科技有限公司&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="login-line line-right"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
