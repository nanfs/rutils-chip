import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Dropdown, Modal, message } from 'antd'
import { NavLink } from 'react-router-dom'
import styles from './index.m.scss'
import getMenuData from '*/menu'
import ConsoleMenu from '@/components/ConsoleMenu'
import SetPwdForm from './SetPwdForm'
import MyIcon from '@/components/MyIcon'
import { USER } from '@/utils/auth'

class Header extends Component {
  openSetPwd = () => {
    this.props.dispatch({
      type: 'app/openSetPwd'
    })
  }

  closeSetPwd = () => {
    this.props.dispatch({
      type: 'app/closeSetPwd'
    })
  }

  onSubmit = payload => {
    if (payload.confirmPassword !== payload.password) {
      message.error('确认密码与新密码不一致！')
    } else {
      this.props.dispatch({
        type: 'app/updatePwd',
        payload
      })
    }
  }

  logout = () => {
    // this.props.dispatch({ type: 'app/openTips', payload: '正在注销...' })
    this.props.dispatch({ type: 'app/logout' })
  }

  render() {
    const {
      className: classNameProp,
      username,
      updateResult,
      dispatch,
      showSetPwd,
      ...other
    } = this.props
    const className = classnames(styles.header, classNameProp)
    const menu = (
      <ConsoleMenu menus={getMenuData()} className={styles.menuWrapper} />
    )
    return (
      <div className={className} {...other}>
        <NavLink to="/dashboard">
          <span className={styles.brand} />
        </NavLink>
        <span className={styles.menu}>
          <Dropdown overlay={menu}>
            <MyIcon type="caidan" component="svg" />
          </Dropdown>
        </span>
        <div className={styles.right}>
          <span className={styles.action}>
            <MyIcon type="yonghu" component="svg" />
            <span>{USER.name}</span>
          </span>
          <span className={styles.action} onClick={this.openSetPwd}>
            <MyIcon type="shezhi" component="svg" />
          </span>
          <span className={styles.action} onClick={this.logout}>
            <MyIcon type="tuichu" component="svg" />
          </span>
        </div>
        <Modal
          title="修改密码"
          visible={showSetPwd}
          footer={null}
          closable={false}
        >
          <SetPwdForm onSubmit={this.onSubmit} onCancel={this.closeSetPwd} />
        </Modal>
      </div>
    )
  }
}

export default connect(({ app, global }) => {
  const { username, showSetPwd } = app
  const {
    data: { 'app/pwdupdatting': updateResult }
  } = global

  return { username, updateResult, showSetPwd }
})(Header)
