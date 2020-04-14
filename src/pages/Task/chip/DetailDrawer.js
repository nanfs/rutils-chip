import React from 'react'
import { Row, Col, Tooltip, message, Tabs } from 'antd'
import {
  Drawerx,
  Tablex,
  SelectSearch,
  Tabsx,
  Diliver,
  Title
} from '@/components'
import { columns } from './TargetTableCfg'
import taskApi from '@/services/task'
import produce from 'immer'

const { TabPane } = Tabs
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex

export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod: taskApi.detail,
      rowKey: 'objectId',
      paging: { size: 10 },
      hasRowSelection: false,
      pageSizeOptions: ['5', '10', '20', '50'],
      searchs: {}
    }),
    initValues: {},
    disabledButton: {}
  }

  /**
   * @memberof DetailDrawer
   * @param id 传入计划任务id
   * @description 打开计划任务详情抽屉
   */
  pop = data => {
    this.drawer.show()
    let time = ''
    if (data.cron) {
      const cronArr = data.cron.split(' ')
      time = `${cronArr[2]}:${cronArr[1]}`
    }
    const taskId = data.id
    const status = data.status === 1 ? '允许' : '禁用'
    const taskType = data.taskType === 1 ? '定时关机' : '定时开机'
    this.setState({
      initValues: { ...data, status, taskType, time },
      tableCfg: createTableCfg({
        columns,
        apiMethod: taskApi.detail,
        rowKey: 'objectId',
        paging: { size: 10 },
        hasRowSelection: false,
        pageSizeOptions: ['5', '10', '20', '50'],
        searchs: { id: taskId }
      })
    })
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({ defaultActiveKey: 'basicInfo', taskId })
    )
  }

  /**
   * 当搜索条件下来处理
   *
   * @memberof Vmlog
   */
  onSearchSelectChange = oldKey => {
    const searchs = { ...this.state.tableCfg.searchs }
    delete searchs[oldKey]
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...searchs
        }
      })
    )
  }

  /**
   * @memberof Task
   * @description 表格搜索
   */
  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.detailTargetTablex.refresh(this.state.tableCfg)
    )
  }

  render() {
    const { initValues, defaultActiveKey } = this.state
    const searchOptions = [{ label: '集群', value: 'clusterName' }]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.props.onClose}
      >
        <Tabsx defaultActiveKey={defaultActiveKey}>
          <TabPane tab="基本信息" key="basicInfo">
            <div className="dms-detail-section">
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  名称：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.name}>
                    <span>{initValues.name}</span>
                  </Tooltip>
                </Col>

                <Col span={3} className="dms-detail-label">
                  执行时间：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.time}>
                    <span>{initValues.time}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  任务类型：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.taskType}>
                    <span>{initValues.taskType}</span>
                  </Tooltip>
                </Col>

                <Col span={3} className="dms-detail-label">
                  状态：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.status}>
                    <span>{initValues.status}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  创建人员：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.createBy}>
                    <span>{initValues.createBy}</span>
                  </Tooltip>
                </Col>

                <Col span={3} className="dms-detail-label">
                  创建时间：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.createTime}>
                    <span>{initValues.createTime}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  最后修改：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.updateTime}>
                    <span>{initValues.updateTime}</span>
                  </Tooltip>
                </Col>

                <Col span={3} className="dms-detail-label">
                  描述：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.description}>
                    <span>{initValues.description}</span>
                  </Tooltip>
                </Col>
              </Row>
            </div>
            <Diliver />
            <div className="dms-detail-section">
              <Title slot="桌面列表"></Title>
              <TableWrap>
                <ToolBar>
                  <BarLeft></BarLeft>
                  <BarRight>
                    <SelectSearch
                      options={searchOptions}
                      onSelectChange={this.onSearchSelectChange}
                      onSearch={this.search}
                    ></SelectSearch>
                  </BarRight>
                </ToolBar>
                <Tablex
                  onRef={ref => {
                    this.detailTargetTablex = ref
                  }}
                  tableCfg={this.state.tableCfg}
                />
              </TableWrap>
            </div>
          </TabPane>
        </Tabsx>
      </Drawerx>
    )
  }
}
