import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoginFrom from './LoginFrom'
import styles from './index.m.scss'
import logo from '../../assets/logo_03.png'
import MyIcon from '@/components/MyIcon'

class Login extends Component {
  handleSubmit = values => {
    this.props.dispatch({
      type: 'login/login',
      payload: values
    })
  }

  handleKeypress = (values, e) => {
    if (e.which !== 13) return
    this.props.dispatch({
      type: 'login/login',
      payload: values
    })
  }

  render() {
    const { login = {} } = this.props
    const { loading, message, success } = login
    return (
      <div className={styles.wrap}>
        <div className={styles['left-wrap']}>
          <img src={logo} />
        </div>
        <div className={styles['right-wrap']}>
          <p className={styles['right-logo']}>
            <MyIcon type="welcome" component="svg" />
          </p>
          <p className={styles['right-title']}>欢迎登陆电科云-成都OA系统</p>
          <LoginFrom
            loading={loading}
            error={!success && message}
            onSubmit={this.handleSubmit}
            onKeyPress={this.handleKeypress}
          />
        </div>
      </div>
    )
  }
}

export default connect(({ global }) => {
  const {
    data: { 'login/login': login }
  } = global
  return { login }
})(Login)
