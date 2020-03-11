import React from 'react'
import { Tabs, Row, Col, Icon, message } from 'antd'
import { Drawerx, Tablex } from '@/components'
import styles from '../index.m.less'
import { columns, apiMethod } from './VmTableCfg'
import produce from 'immer'

const { TabPane } = Tabs
const { createTableCfg } = Tablex

export default class DetailDrawer extends React.Component {
  state = {
    data: {},
    id: '',
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

  pop = info => {
    this.drawer.show()
    this.setState({ data: info })
    if (this.state.id) {
      this.setState({ id: info.id })
      this.setState(
        produce(draft => {
          draft.tableCfg.searchs = {
            id: info.id
          }
        }),
        () => this.vmtablex.replace(this.state.tableCfg)
      )
    } else {
      this.setState({ id: info.id })
      this.setState(
        produce(draft => {
          draft.tableCfg.searchs = {
            id: info.id
          }
        })
      )
    }
  }

  render() {
    const { data } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
      >
        <Tabs>
          <TabPane tab="基本信息" key="basicInfo">
            <Row gutter={32} className={styles.rowMargin}>
              <Col span={4}>模板名称：</Col>
              <Col span={8}>{data.name}</Col>
              <Col span={4}>已使用桌面：</Col>
              <Col span={8}>{data.vmUsed}</Col>
            </Row>
            <Row gutter={32} className={styles.rowMargin}>
              <Col span={4}>父模板：</Col>
              <Col span={8}>{data.parentName}</Col>
              <Col span={4}>数据中心/集群：</Col>
              <Col span={8}>
                {data.datacenterName}/{data.clusterName}
              </Col>
            </Row>
            <Row gutter={32} className={styles.rowMargin}>
              <Col span={4}>描述：</Col>
              <Col span={8}>{data.description}</Col>
              <Col span={4}>状态：</Col>
              {data.status == '1' && (
                <Col span={8}>
                  <Icon type="lock" className={styles.lock} /> 锁定
                </Col>
              )}
              {data.status == '0' && (
                <Col span={8} className={styles['can-use']}>
                  <Icon type="check-circle" /> 可用
                </Col>
              )}
              {data.status == '2' && (
                <Col span={8} className={styles.safety}>
                  <Icon type="safety" /> 合法
                </Col>
              )}
            </Row>
          </TabPane>
          <TabPane tab="使用桌面列表" key="bindVmList">
            <Tablex
              onRef={ref => {
                this.vmtablex = ref
              }}
              tableCfg={this.state.tableCfg}
            />
          </TabPane>
        </Tabs>
      </Drawerx>
    )
  }
}
