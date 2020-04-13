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

import { transform } from '@/utils/dict'
import ResetPwModal from './chip/ResetPwModal'
import SystemModal from './chip/SystemModal'
import AboutModal from './chip/AboutModal'
import loginApi from '@/services/login'
import tasksApi from '@/services/tasks'

const { TabPane } = Tabs
export default class Header extends React.Component {
  setTaskListShow = e => {
    e.nativeEvent.stopImmediatePropagation()
    this.setState({ taskVisible: true })
  }

  toggleTaskList = e => {
    e.nativeEvent.stopImmediatePropagation()
    this.setState({ taskVisible: !this.state.taskVisible })
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
    document.body.addEventListener('click', this.onDocumentClick)
    this.timer && clearInterval(this.timer)
    this.getTasks()
    this.timer = this.loopGetTask()
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  loopGetTask = () => {
    return setInterval(() => this.getTasks(), 5000)
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
          res.data.records.forEach(task => {
            const { status } = task
            if (status === 'FINISHED') {
              taskOnFinished.push(task)
            }
            if (status === 'STARTED') {
              taskOnProgress.push(task)
            }
          })
          this.setState({
            taskOnProgress,
            taskOnFinished,
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
                avatar={
                  type === 'onProgress' ? (
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                      <Icon type="sync" spin />
                    </Avatar>
                  ) : (
                    <Avatar style={{ backgroundColor: '#87d068' }}>
                      <Icon type="check-circle" />
                    </Avatar>
                  )
                }
                title={<a>{transform(item.action_type)}</a>}
                description={transform(item.description)}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    )
  }

  renderTaskList = () => {
    const { taskOnProgress, taskOnFinished } = this.state || {}
    return (
      <div className="header-task-list" onClick={() => false}>
        <Tabs animated={false}>
          <TabPane tab={`进行中(${taskOnProgress?.length})`} key="1">
            {this.renderTaskItem(taskOnProgress, 'onProgress')}
          </TabPane>
          <TabPane tab={`已完成(${taskOnFinished?.length})`} key="2">
            {this.renderTaskItem(taskOnFinished)}
          </TabPane>
        </Tabs>
      </div>
    )
  }

  render() {
    return (
      <Layout.Header className="header">
        <div className="logo">
          <span className="text">安全虚拟桌面管理</span>
        </div>
        <Menu mode="horizontal">
          <Menu.Item key="username">
            <Icon type="user" />
            <span>{getUserFromlocal()}</span>
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
          <Menu.Item key="task" className="no-padding">
            <Dropdown
              overlay={this.renderTaskList()}
              trigger={['click']}
              placement="bottomRight"
              visible={this.state?.taskVisible}
              onOverlayClick={this.setTaskListShow}
            >
              <div
                onClick={this.toggleTaskList}
                className={
                  this.state?.taskVisible ? 'drop-item active' : 'drop-item'
                }
              >
                <Badge count={this.state?.taskTotal}>
                  <Icon type="bell" />
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
            <Icon type="cloud" />
            <span>关于</span>
          </Menu.Item>
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
