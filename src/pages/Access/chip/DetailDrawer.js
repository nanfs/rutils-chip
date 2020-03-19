import React from 'react'
import { Tabs, Row, Col, Icon, Popover, Tooltip } from 'antd'
import { Drawerx, Tablex, MyIcon, Tabsx } from '@/components'
import '../index.less'
import { columns, apiMethod } from './TerminalTableCfg'
import produce from 'immer'

const { TabPane } = Tabs
const { createTableCfg } = Tablex
function renderDateText(text) {
  if (text === undefined || text === null) {
    return ''
  }
  if (text.includes('<>')) {
    return text.replace('<>', '~')
  }
  const weekArr = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return text
    .split(',')
    .map(item => weekArr[item])
    .join(',')
}
const typeArr = ['按周', '按日期']

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
    this.setState({
      data: info,
      type: typeArr[info.admitInterval[0].type],
      date: renderDateText(info.admitInterval[0].date),
      startTime: info.admitInterval[0].startTime,
      endTime: info.admitInterval[0].endTime
    })
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
    const {
      data,
      defaultActiveKey,
      type,
      date,
      startTime,
      endTime
    } = this.state
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
                  准入类型：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={type}>
                    <span>{type}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  日期：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={date}>
                    <span>{date}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  时间：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <span>
                    {startTime} - {endTime}
                  </span>
                </Col>
                <Col span={3} className="dms-detail-label">
                  描述：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.description}>
                    <span>{data.description}</span>
                  </Tooltip>
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
