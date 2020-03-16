import React from 'react'
import { Tabs, Row, Col, Icon, message } from 'antd'
import { Drawerx, Tablex, Tabsx } from '@/components'
import styles from '../index.m.less'
import { columns, apiMethod } from './VmTableCfg'
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
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
      >
        <Tabsx defaultActiveKey={defaultActiveKey}>
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
              <Col span={4}>数据中心：</Col>
              <Col span={8}>{data.datacenterName}</Col>
            </Row>
            <Row gutter={32} className={styles.rowMargin}>
              <Col span={4}>集群：</Col>
              <Col span={8}>{data.clusterName}</Col>
              <Col span={4}>描述：</Col>
              <Col span={8}>{data.description}</Col>
            </Row>
            <Row>
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
          <TabPane tab="桌面列表" key="bindVmList">
            <Tablex
              onRef={ref => {
                this.vmtablex = ref
              }}
              tableCfg={this.state.tableCfg}
            />
          </TabPane>
        </Tabsx>
      </Drawerx>
    )
  }
}
