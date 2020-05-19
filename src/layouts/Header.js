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
  Skeleton,
  Button
} from 'antd'
import { Link } from 'react-router-dom'
import { getUser, checkAuth, checkAuthName } from '@/utils/checkPermissions'
import { setItemToLocal } from '@/utils/storage'
import { wrapResponse } from '@/utils/tool'
import ResetPwModal from './chip/ResetPwModal'
import SystemModal from './chip/SystemModal'
import AboutModal from './chip/AboutModal'
import loginApi from '@/services/login'
import tasksApi from '@/services/tasks'
import vmlogsApi from '@/services/vmlogs'

const { TabPane } = Tabs
export default class Header extends React.Component {
  setTaskListShow = e => {
    e.nativeEvent.stopImmediatePropagation()
    clearTimeout(this.taskListTimer)
    this.setState({ logVisible: false, taskVisible: true })
  }

  setTaskListClose = e => {
    e.nativeEvent.stopImmediatePropagation()
    this.taskListTimer = setTimeout(
      () => this.setState({ taskVisible: false }),
      500
    )
  }

  setLogListShow = e => {
    e.nativeEvent.stopImmediatePropagation()
    clearTimeout(this.logListTimer)
    this.setState({ taskVisible: false, logVisible: true })
  }

  setLogListClose = e => {
    e.nativeEvent.stopImmediatePropagation()
    this.logListTimer = setTimeout(
      () => this.setState({ logVisible: false }),
      500
    )
  }

  onDocumentClick = () => {
    this.setState({ taskVisible: false, logVisible: false })
  }

  /**
   * @description 启动定时获取 任务列表
   * @author lishuai
   * @date 2020-04-08
   */
  componentDidMount() {
    // 添加三员权限控制  头部日志仅显示错误日志 除管理员外其他没有
    window.addEventListener('click', this.onDocumentClick)
    if (checkAuth('admin')) {
      this.timer && clearInterval(this.timer)
      this.getTasks()
      this.getLogs()
      this.timer = this.loopGet()
    }
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  loopGet = () => {
    return setInterval(() => {
      this.getTasks()
      this.getLogs()
    }, 5000)
  }

  /**
   *获取任务列表
   *taskTotal 显示正在进行的任务
   * @memberof Header
   */
  getTasks = () => {
    tasksApi.list({ current: 1, size: 10000, getType: 'reload' }).then(res =>
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
            taskTotal: taskOnProgress?.length || taskOnFailed?.length
          })
        })
        .catch(error => {
          message.error(error.message || error)
          console.log(error)
        })
    )
  }

  /**
   *获取错误日志列表
   *taskTotal 显示正在进行的任务
   * @memberof Header
   */
  getLogs = () => {
    vmlogsApi
      .list({
        current: 1,
        size: 5,
        getType: 'reload',
        severity: ['2'],
        message: '虚拟机'
      })
      .then(res =>
        wrapResponse(res)
          .then(() => {
            this.setState({
              logList: res.data.records,
              logTotal: res.data.total
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
    setItemToLocal(null)
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
        className="header-drop-list"
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

  renderLogList = () => {
    const { logList } = this.state || {}
    return (
      <div
        className="header-drop-list"
        onClick={() => false}
        onMouseLeave={this.setLogListClose}
        onMouseEnter={this.setLogListShow}
      >
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          loadMore={this.loadMore}
          dataSource={logList}
          renderItem={item => (
            <List.Item>
              <Link
                to={{
                  pathname: '/vmlog',
                  searchs: {
                    severity: ['2'],
                    message: item.message
                  }
                }}
                replace
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={24}
                      style={{ backgroundColor: '#f50', fontSize: 12 }}
                    >
                      <Icon type="close" />
                    </Avatar>
                  }
                  title={item.logTime}
                  description={item.message}
                />
              </Link>
            </List.Item>
          )}
        />
        <Button className="list-more-btn" block>
          <Link
            to={{
              pathname: '/vmlog',
              searchs: {
                severity: ['2']
              }
            }}
            replace
          >
            (当前显示最近5条)点击查看更多
          </Link>
        </Button>
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
        <div
          className="logo"
          onClick={() => {
            return this.props.history.push('/dashboard')
          }}
        >
          <span className="text">安全虚拟桌面管理</span>
        </div>
        <Menu mode="horizontal" className="header-menu">
          <Menu.Item key="task" hidden={!checkAuth('admin')}>
            <Dropdown
              overlay={this.renderTaskList()}
              placement="bottomCenter"
              visible={this.state?.taskVisible}
              onOverlayClick={this.setTaskListShow}
              onMouseEnter={this.setTaskListShow}
              onMouseLeave={this.setTaskListClose}
            >
              <div
                className={
                  this.state?.taskVisible ? 'drop-item active' : 'drop-item'
                }
              >
                <Badge
                  count={this.state?.taskTotal}
                  offset={[5, 0]}
                  className={
                    this.state?.taskOnProgress?.length && 'count-onprogress'
                  }
                >
                  <Icon type="bell" />
                  任务
                </Badge>
              </div>
            </Dropdown>
          </Menu.Item>
          <Menu.Item key="logs" hidden={!checkAuth('admin')}>
            <Dropdown
              overlay={this.renderLogList()}
              placement="bottomCenter"
              visible={this.state?.logVisible}
              onOverlayClick={this.setLogListShow}
              onMouseEnter={this.setLogListShow}
              onMouseLeave={this.setLogListClose}
            >
              <div
                className={
                  this.state?.logVisible ? 'drop-item active' : 'drop-item'
                }
              >
                <Badge offset={[5, 0]}>
                  <Icon type="exception" />
                  日志
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
            // 用户名字是admin
            hidden={!checkAuthName('admin')}
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
                <span>{getUser()}</span>&nbsp;
                <Icon type="caret-down" />
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
