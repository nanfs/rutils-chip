import React from 'react'
import { Row, Col, Tooltip, Tabs } from 'antd'
import produce from 'immer'
import { Tablex, Drawerx, Title } from '@/components'
import {
  detailTeminalColumns,
  detailTeminalApiMethod
} from './DetailTerminalTableCfg'
import {
  detailDesktopColumns,
  detailDesktopApiMethod
} from './DetailDesktopTableCfg'

const { TabPane } = Tabs
const { createTableCfg } = Tablex
export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    terminalTableCfg: createTableCfg({
      apiMethod: detailTeminalApiMethod,
      columns: detailTeminalColumns,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10', '20', '50'],
      hasRowSelection: false,
      rowKey: 'name'
    }),
    desktopTableCfg: createTableCfg({
      apiMethod: detailDesktopApiMethod,
      columns: detailDesktopColumns,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10', '20', '50'],
      hasRowSelection: false,
      rowKey: 'vmname'
    }),
    initValues: {}
  }

  pop = data => {
    this.drawer.show()
    this.setState(
      produce(draft => {
        draft.initValues = {
          ...data,
          statusName: data.status === 0 ? '正常' : '禁用'
        }
        draft.terminalTableCfg.searchs = {
          ...draft.terminalTableCfg.searchs,
          userId: data.id
        }
        draft.desktopTableCfg.searchs = {
          ...draft.desktopTableCfg.searchs,
          userId: data.id
        }
      }),
      () => {
        this.desktopTablex.refresh(this.state.desktopTableCfg)
        this.terminalTablex.refresh(this.state.terminalTableCfg)
      }
    )
  }

  render() {
    const { initValues } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
        onClose={this.props.onClose}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="基本信息" key="1">
            <div className="dms-detail-section">
              {/* <Title slot="基础设置"></Title> */}
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  用户名：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.username}>
                    <span>{initValues.username}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  姓名：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.name}>
                    <span>{initValues.name}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  组织：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.groupName}>
                    <span>{initValues.groupName}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  角色：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.roleName}>
                    <span>{initValues.roleName}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  邮箱：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.email}>
                    <span>{initValues.email}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  状态：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.statusName}>
                    <span>{initValues.statusName}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  已分配桌面数：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.vmcount}>
                    <span>{initValues.vmcount}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  已分配终端数：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.tccount}>
                    <span>{initValues.tccount}</span>
                  </Tooltip>
                </Col>
              </Row>
            </div>
            <div className="dms-detail-section">
              <Title slot="已分配桌面"></Title>
              <Tablex
                onRef={ref => {
                  this.desktopTablex = ref
                }}
                className="no-select-bg"
                tableCfg={this.state.desktopTableCfg}
                onSelectChange={(selection, selectData) => {
                  this.setState({ selection, selectData })
                }}
                stopAutoFetch={true}
              />
            </div>
            <div className="dms-detail-section">
              <Title slot="已分配终端"></Title>
              <Tablex
                onRef={ref => {
                  this.terminalTablex = ref
                }}
                className="no-select-bg"
                tableCfg={this.state.terminalTableCfg}
                onSelectChange={(selection, selectData) => {
                  this.setState({ selection, selectData })
                }}
                stopAutoFetch={true}
              />
            </div>
          </TabPane>
          {/* <TabPane tab="已分配桌面" key="2" forceRender={true}>
            <Tablex
              onRef={ref => {
                this.desktopTablex = ref
              }}
              className="no-select-bg"
              tableCfg={this.state.desktopTableCfg}
              onSelectChange={(selection, selectData) => {
                this.setState({ selection, selectData })
              }}
              stopAutoFetch={true}
            />
          </TabPane>
          <TabPane tab="已分配终端" key="3" forceRender={true}>
            <Tablex
              onRef={ref => {
                this.terminalTablex = ref
              }}
              className="no-select-bg"
              tableCfg={this.state.terminalTableCfg}
              onSelectChange={(selection, selectData) => {
                this.setState({ selection, selectData })
              }}
              stopAutoFetch={true}
            />
          </TabPane> */}
        </Tabs>
      </Drawerx>
    )
  }
}
