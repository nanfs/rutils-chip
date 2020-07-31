import React from 'react'
import { NavLink } from 'react-router-dom'
import { Drawer, Button, Icon, Steps } from 'antd'
import { MyIcon } from '@/components'
import './base.less'

const { Step } = Steps

class ShortcutDrawer extends React.Component {
  state = {
    visible: false
  }

  componentDidMount = () => {
    //  document
    //   .querySelector('.ant-drawer-content-wrapper')
    //   .addEventListener('mouseleave', () => {
    //     this.setState({ visible: false })
    //   })
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="shortcut-button"
          style={{ display: this.state.visible ? 'none' : 'block' }}
          type="primary"
          onMouseOver={() => {
            this.setState({ visible: true })
            document.body.style.maxHeight = '100vh'
            // document.body.style.overflow = 'hidden'
            if (document.querySelector('.table-wrap')) {
              document.querySelector('.table-wrap').style.height =
                'calc(100vh - 105px)'
              document.querySelector('.table-wrap').style.overflow = 'hidden'
            }
            if (document.querySelector('.ant-drawer-body')) {
              document.querySelector('.ant-drawer-body').style.Height =
                'calc(100vh - 185px)'
            }
          }}
        >
          <Icon type="form" style={{ fontSize: 20 }} />
        </Button>
        <Drawer
          className="shortcut-drawer"
          title="快捷操作"
          placement="right"
          closable={false}
          onClose={() => this.setState({ visible: false })}
          visible={this.state.visible}
          style={{ position: 'absolute' }}
          getContainer={false}
        >
          <div className="shortcut-drawer-steps-title">
            <MyIcon type="zhuomianguanli" style={{ marginRight: 5 }} />
            桌面管理
          </div>
          <Steps
            progressDot
            current={5}
            direction="vertical"
            className="shortcut-drawer-steps"
          >
            <Step
              title={
                <NavLink to={{ pathname: 'desktop', search: 'openAdd' }}>
                  创建桌面
                </NavLink>
              }
            />
            <Step
              title={
                <NavLink to={{ pathname: 'pool', search: 'openAdd' }}>
                  创建桌面池
                </NavLink>
              }
            />
            <Step
              title={
                <NavLink to={{ pathname: 'task', search: 'openAdd' }}>
                  创建计划任务
                </NavLink>
              }
            />
          </Steps>
          <div className="shortcut-drawer-steps-title">
            <MyIcon type="terminal" style={{ marginRight: 5 }} />
            终端管理
          </div>
          <Steps
            progressDot
            current={5}
            direction="vertical"
            className="shortcut-drawer-steps"
          >
            <Step
              title={
                <NavLink to={{ pathname: 'device', search: 'openAdd' }}>
                  创建外设控制
                </NavLink>
              }
            />
            <Step
              title={
                <NavLink to={{ pathname: 'access', search: 'openAdd' }}>
                  创建准入控制
                </NavLink>
              }
            />
            <Step
              title={
                <NavLink to={{ pathname: 'upgrade', search: 'openAdd' }}>
                  上传升级包
                </NavLink>
              }
            />
          </Steps>
          <div className="shortcut-drawer-steps-title">
            <MyIcon type="yonghuguanli" style={{ marginRight: 5 }} />
            用户管理
          </div>
          <Steps
            progressDot
            current={5}
            direction="vertical"
            className="shortcut-drawer-steps"
          >
            <Step
              title={
                <NavLink to={{ pathname: 'user', search: 'openAdd' }}>
                  创建用户
                </NavLink>
              }
            />
          </Steps>
        </Drawer>
      </React.Fragment>
    )
  }
}
export default ShortcutDrawer
