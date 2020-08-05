import React, { Component } from 'react'
import LoginFrom from './chip/LoginFrom'
import './login.less'
import loginApi from '@/services/login'
import { setItemToLocal } from '@/utils/storage'

export default class Login extends Component {
  state = {
    version: 'V1.5.0',
    build: '3567'
  }

  componentDidMount() {
    loginApi.getProperties().then(res => {
      const { version: verRes, build: buildRes } = res
      const { version: verState, build: buildState } = this.state
      const version = verRes || verState
      const build = buildRes || buildState
      this.setState({ version, build }, () =>
        setItemToLocal({ version, build })
      )
    })
  }

  render() {
    const { version, build } = this.state
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
              <span>
                {version} build {build}
              </span>
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
