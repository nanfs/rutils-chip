import React from 'react'
import { Tabs, Row, Col, Icon, Popover, Tooltip } from 'antd'
import { Drawerx, Tablex, MyIcon, Tabsx } from '@/components'
import '../index.less'
import { columns, apiMethod } from './TerminalTableCfg'
import produce from 'immer'

const { TabPane } = Tabs
const { createTableCfg } = Tablex

export default class DetailDrawer extends React.Component {
  state = {
    data: {},
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      expandedRowRender: false,
      hasRowSelection: false,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    })
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (ids, info) => {
    this.drawer.show()
    this.setState({ data: info })
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({ defaultActiveKey: 'basicInfo', ids })
    )
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          id: ids
        }
      })
    )
  }

  render() {
    const { data, defaultActiveKey } = this.state
    const info = data.usbs
      ? data.usbs.map((item, index) => (
          <p key={index}>
            name：{item.name}，vid：{item.vid}，pid:{item.pid}
          </p>
        ))
      : ''
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
      >
        <Tabsx defaultActiveKey={defaultActiveKey}>
          <TabPane tab="基本信息" key="basicInfo">
            <div className="dms-detail-section">
              {/* <Title slot="基础设置"></Title> */}
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  名称：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.name}>
                    <span>{data.name}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  已绑定终端数：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.boundTcNum}>
                    <span>{data.boundTcNum}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  USB外设：
                </Col>
                {data.usagePeripherals == '1' && (
                  <Col span={8} className="dms-detail-value">
                    <Icon type="check-circle" style={{ color: '#19c0f0' }} />{' '}
                    开启
                  </Col>
                )}
                {data.usagePeripherals == '0' && (
                  <Col span={8} className="dms-detail-value">
                    <Icon type="stop" style={{ color: '#ee1c3a' }} /> 禁止
                  </Col>
                )}
                <Col span={3} className="dms-detail-label">
                  描述：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.description}>
                    <span>{data.boundTcNum}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  名单：
                </Col>
                <Col span={8} className="dms-detail-value">
                  {info.length ? (
                    <Popover content={info}>
                      <MyIcon
                        type="order-info"
                        component="svg"
                        style={{ cursor: 'pointer' }}
                      />
                    </Popover>
                  ) : (
                    <span>无</span>
                  )}
                </Col>
              </Row>
            </div>
          </TabPane>
          <TabPane tab="终端列表" key="bindTerminalList">
            <Tablex
              onRef={ref => {
                this.terminalTablex = ref
              }}
              tableCfg={this.state.tableCfg}
            />
          </TabPane>
        </Tabsx>
      </Drawerx>
    )
  }
}
