import React from 'react'
import {
  Layout,
  Menu,
  message,
  Icon,
  Badge,
  Dropdown,
  Tabs,
  List,
  Avatar,
  Skeleton
} from 'antd'
import {
  getUserFromlocal,
  setUserToLocal,
  reloadAuthorized
} from '@/utils/auth'
import { wrapResponse } from '@/utils/tool'

import ResetPwModal from './chip/ResetPwModal'
import SystemModal from './chip/SystemModal'
import AboutModal from './chip/AboutModal'
import loginApi from '@/services/login'
import tasksApi from '@/services/tasks'
import usersApi from '@/services/user'

const { TabPane } = Tabs
export default class Header extends React.Component {
  setTaskListShow = e => {
    e.nativeEvent.stopImmediatePropagation()
    clearTimeout(this.taskListTimer)
    this.setState({ taskVisible: true })
  }

  setTaskListClose = e => {
    e.nativeEvent.stopImmediatePropagation()
    this.taskListTimer = setTimeout(
      () => this.setState({ taskVisible: false }),
      500
    )
  }

  toggleTaskList = e => {
    e.nativeEvent.stopImmediatePropagation()
    this.setState({ taskVisible: true })
  }

  onDocumentClick = () => {
    this.setState({ taskVisible: false })
  }

  /**
   * @description 启动定时获取 任务列表
   * @author lishuai
   * @date 2020-04-08
   */
  componentDidMount() {
    window.addEventListener('click', this.onDocumentClick)
    this.timer && clearInterval(this.timer)
    this.getTasks()
    this.timer = this.loopGetTask()
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  loopGetTask = () => {
    return setInterval(() => {
      this.getTasks()
      this.checkSession()
    }, 5000)
  }

  checkSession = () => {
    usersApi.checkSession().then(res => wrapResponse(res))
  }

  /**
   *获取任务列表
   *taskTotal 显示正在进行的任务
   * @memberof Header
   */
  getTasks = () => {
    tasksApi.list({ current: 1, size: 10000 }).then(res =>
      wrapResponse(res)
        .then(() => {
          const taskOnProgress = []
          const taskOnFinished = []
          const taskOnFailed = []
          res.data.records.forEach(task => {
            const { status } = task
            if (status === 'FINISHED') {
              taskOnFinished.push(task)
            }
            if (status === 'STARTED') {
              taskOnProgress.push(task)
            }
            if (status === 'FAILED') {
              taskOnFailed.push(task)
            }
          })
          this.setState({
            taskOnProgress,
            taskOnFinished,
            taskOnFailed,
            taskTotal: taskOnProgress?.length
          })
        })
        .catch(error => {
          message.error(error.message || error)
          console.log(error)
        })
    )
  }

  /**
   *登出操作
   *
   * @memberof Header
   */
  logOut = () => {
    window.removeEventListener('click', this.onDocumentClick)
    setUserToLocal(null)
    reloadAuthorized()
    loginApi
      .loginOut()
      .then(res => {
        if (res.success) {
          return this.props.history.push('/login')
        } else {
          message.error(res.message || '操作失败')
        }
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  renderAvatar = type => {
    if (type === 'STARTED') {
      return (
        <Avatar style={{ backgroundColor: '#1890ff' }}>
          <Icon type="sync" spin />
        </Avatar>
      )
    }
    if (type === 'FINISHED') {
      return (
        <Avatar style={{ backgroundColor: '#87d068' }}>
          <Icon type="check-circle" />
        </Avatar>
      )
    }
    return (
      <Avatar style={{ backgroundColor: '#f50' }}>
        <Icon type="close" />
      </Avatar>
    )
  }

  renderTaskItem = (tasks, type) => {
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        loadMore={this.loadMore}
        dataSource={tasks}
        renderItem={item => (
          <List.Item>
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={this.renderAvatar(type)}
                title={<a>{item.action_type}</a>}
                description={item.description}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    )
  }

  renderTaskList = () => {
    const { taskOnProgress, taskOnFinished, taskOnFailed } = this.state || {}
    return (
      <div
        className="header-task-list"
        onClick={() => false}
        onMouseLeave={this.setTaskListClose}
        onMouseEnter={this.setTaskListShow}
      >
        <Tabs animated={false}>
          <TabPane tab={`执行中(${taskOnProgress?.length})`} key="1">
            {this.renderTaskItem(taskOnProgress, 'STARTED')}
          </TabPane>
          <TabPane tab={`已完成(${taskOnFinished?.length})`} key="2">
            {this.renderTaskItem(taskOnFinished, 'FINISHED')}
          </TabPane>
          <TabPane tab={`失败(${taskOnFailed?.length})`} key="3">
            {this.renderTaskItem(taskOnFailed, 'FAILED')}
          </TabPane>
        </Tabs>
      </div>
    )
  }

  renderUserInfo = () => {
    return (
      <div className="header-task-list">
        <Menu>
          <Menu.Item
            key="changePwd"
            onClick={() => {
              this.modal.pop()
            }}
          >
            <Icon type="lock" />
            <span>修改密码</span>
          </Menu.Item>
          <Menu.Item key="logout" onClick={this.logOut}>
            <Icon type="logout" />
            <span>注销</span>
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  render() {
    return (
      <Layout.Header className="header">
        <div className="logo">
          <span className="text">安全虚拟桌面管理</span>
        </div>
        <Menu mode="horizontal" className="header-menu">
          <Menu.Item key="task">
            <Dropdown
              overlay={this.renderTaskList()}
              placement="bottomCenter"
              visible={this.state?.taskVisible}
              onOverlayClick={this.setTaskListShow}
              onMouseEnter={this.setTaskListShow}
              onMouseLeave={this.setTaskListClose}
            >
              <div
                onClick={this.toggleTaskList}
                className={
                  this.state?.taskVisible ? 'drop-item active' : 'drop-item'
                }
              >
                <Badge count={this.state?.taskTotal} offset={[5, 0]}>
                  <Icon type="bell" />
                  任务
                </Badge>
              </div>
            </Dropdown>
          </Menu.Item>
          <Menu.Item
            key="about"
            onClick={() => {
              this.aboutModal.pop()
            }}
          >
            <Icon type="info-circle" />
            <span>关于</span>
          </Menu.Item>
          <Menu.Item
            key="systemConfig"
            onClick={() => {
              this.sysModal.pop()
            }}
          >
            <Icon type="setting" />
            <span>系统设置</span>
          </Menu.Item>
          <Menu.Item key="userInfo">
            <Dropdown overlay={this.renderUserInfo()} placement="bottomCenter">
              <div>
                <Icon type="user" />
                <span>{getUserFromlocal()}</span>
              </div>
            </Dropdown>
          </Menu.Item>
        </Menu>

        <ResetPwModal
          onRef={ref => {
            this.modal = ref
          }}
        />
        <SystemModal
          onRef={ref => {
            this.sysModal = ref
          }}
        />
        <AboutModal
          onRef={ref => {
            this.aboutModal = ref
          }}
        />
      </Layout.Header>
    )
  }
}
