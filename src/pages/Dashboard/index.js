import React from 'react'
import { message, Row, Col } from 'antd'
import TitleInfo from '@/components/Title/TitleInfo'
import LogList from './chip/LogList'
import DonutChart from './chip/DonutChart'
import LineChart from './chip/LineChart'

import dashboardApi from '@/services/dashboard'
import tclogsApi from '@/services/tclogs'
import vmlogsApi from '@/services/vmlogs'

import moment from 'moment'

import './index.scss'

class Dashboard extends React.Component {
  componentDidMount() {
    dashboardApi
      .desktopsStatistics()
      .then(res => {
        if (res.success) {
          if (res.data) {
            this.setState({
              desktopsStatisticsDountData: [
                {
                  name: '正在运行',
                  count: res.data.running
                },
                {
                  name: '已停止',
                  count: res.data.stopped
                }
              ],
              desktopsStatisticsLineData: [
                {
                  name: '已分配',
                  count: res.data.bounded,
                  sum: res.data.total
                },
                {
                  name: '正在使用',
                  count: res.data.inuse,
                  sum: res.data.total
                }
              ],
              desktopsStatisticsTotal: res.data.total
            })
          }
        } else {
          message.error(res.message || '查询桌面统计失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
    dashboardApi
      .poolsStatistics()
      .then(res => {
        if (res.success) {
          if (res.data) {
            this.setState({
              poolsStatisticsDountData: [
                {
                  name: '正在运行',
                  count: res.data.running
                },
                {
                  name: '已停止',
                  count: res.data.stopped
                }
              ],
              poolsStatisticsLineData: [
                {
                  name: '已分配',
                  count: res.data.bounded,
                  sum: res.data.total
                }
              ],
              poolsStatisticsTotal: res.data.total
            })
          }
        } else {
          message.error(res.message || '查询桌面池统计失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
    dashboardApi
      .terminalsStatistics()
      .then(res => {
        if (res.success) {
          if (res.data) {
            this.setState({
              terminalsStatisticsDountData: [
                {
                  name: '在线',
                  count: res.data.online
                },
                {
                  name: '离线',
                  count: res.data.offline
                }
              ],
              terminalsStatisticsLineData: [
                {
                  name: '已分配用户',
                  count: res.data.boundUserCount,
                  sum: res.data.total
                },
                {
                  name: '已设置准入控制',
                  count: res.data.boundAdmissionPolicyCount,
                  sum: res.data.total
                },
                {
                  name: '已设置外设控制',
                  count: res.data.boundSecurityPolicyCount,
                  sum: res.data.total
                }
              ],
              terminalsStatisticsTotal: res.data.total
            })
          }
        } else {
          message.error(res.message || '查询终端统计失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
    dashboardApi
      .usersStatistics()
      .then(res => {
        if (res.success) {
          if (res.data) {
            this.setState({
              usersStatisticsDountData: [
                {
                  name: '在线',
                  count: res.data.online
                },
                {
                  name: '离线',
                  count: res.data.offline
                }
              ],
              usersStatisticsLineData: [
                {
                  name: '已分配用户',
                  count: res.data.bounded,
                  sum: res.data.total
                }
              ],
              usersStatisticsTotal: res.data.total
            })
          }
        } else {
          message.error(res.message || '查询用户统计失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
    tclogsApi
      .list()
      .then(res => {
        if (res.success) {
          if (res.data) {
            this.setState({
              tclogsData: res.data.records
            })
          }
        } else {
          message.error(res.message || '获取日志失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
    vmlogsApi
      .list()
      .then(res => {
        if (res.success) {
          if (res.data) {
            this.setState({
              vmlogsData: res.data.records
            })
          }
        } else {
          message.error(res.message || '获取日志失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  state = {
    desktopsStatisticsDountData: [],
    desktopsStatisticsLineData: [],
    desktopsStatisticsTotal: 0,
    poolsStatisticsDountData: [],
    poolsStatisticsLineData: [],
    poolsStatisticsTotal: 0,
    terminalsStatisticsDountData: [],
    terminalsStatisticsLineData: [],
    terminalsStatisticsTotal: 0,
    usersStatisticsDountData: [],
    usersStatisticsLineData: [],
    usersStatisticsTotal: 0,
    tclogsData: [],
    vmlogsData: [],
    logData: []
  }

  compareLogTime = property => {
    return function(a, b) {
      const value1 = a[property]
      const value2 = b[property]
      return moment(value2) - moment(value1)
    }
  }

  render() {
    const {
      desktopsStatisticsDountData,
      desktopsStatisticsLineData,
      desktopsStatisticsTotal,
      poolsStatisticsDountData,
      poolsStatisticsLineData,
      poolsStatisticsTotal,
      terminalsStatisticsDountData,
      terminalsStatisticsLineData,
      terminalsStatisticsTotal,
      usersStatisticsDountData,
      usersStatisticsLineData,
      usersStatisticsTotal,
      tclogsData,
      vmlogsData
    } = this.state
    const logData = tclogsData
      .concat(vmlogsData)
      .sort(this.compareLogTime('logTime'))
      .slice(0, 10)
    return (
      <React.Fragment>
        <div className="dashboard-wrap">
          <div className="dashboard-charts">
            <Row>
              <Col span={12} style={{ paddingRight: 20, marginBottom: 20 }}>
                <div className="dashboard-chart-wrap">
                  <div className="dashboard-chart-title">
                    <TitleInfo slot="桌面" more="更多&gt;" url="desktop" />
                  </div>
                  <DonutChart
                    guideTitle="桌面统计"
                    dataSum={desktopsStatisticsTotal}
                    DonutChartData={desktopsStatisticsDountData}
                  />
                  <LineChart
                    lineChartData={desktopsStatisticsLineData}
                    dataSum={desktopsStatisticsTotal}
                  />
                </div>
              </Col>
              <Col span={12} className="dashboard-chart-wrap">
                <div className="dashboard-chart-title">
                  <TitleInfo slot="桌面池" more="更多&gt;" url="pool" />
                </div>
                <DonutChart
                  guideTitle="桌面池统计"
                  dataSum={poolsStatisticsTotal}
                  DonutChartData={poolsStatisticsDountData}
                />
                <LineChart
                  lineChartData={poolsStatisticsLineData}
                  dataSum={poolsStatisticsTotal}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ paddingRight: 20 }}>
                <div className="dashboard-chart-wrap">
                  <div className="dashboard-chart-title">
                    <TitleInfo slot="终端" more="更多&gt;" url="terminal" />
                  </div>
                  <DonutChart
                    guideTitle="终端统计"
                    dataSum={terminalsStatisticsTotal}
                    DonutChartData={terminalsStatisticsDountData}
                  />
                  <LineChart
                    lineChartData={terminalsStatisticsLineData}
                    dataSum={terminalsStatisticsTotal}
                  />
                </div>
              </Col>
              <Col span={12} className="dashboard-chart-wrap">
                <div className="dashboard-chart-title">
                  <TitleInfo slot="用户" more="更多&gt;" url="user" />
                </div>
                <DonutChart
                  guideTitle="用户统计"
                  dataSum={usersStatisticsTotal}
                  DonutChartData={usersStatisticsDountData}
                />
                <LineChart
                  lineChartData={usersStatisticsLineData}
                  dataSum={usersStatisticsTotal}
                />
              </Col>
            </Row>
          </div>
          <div className="dashboard-tclog">
            <div className="dashboard-tclog-title">
              {/* <span className="dashboard-tclog-title-text">日志</span> */}
              <TitleInfo slot="日志" more="更多&gt;" url="vmlog" />
              {/* <span className="dashboard-tclog-title-more">更多&gt;</span> */}
            </div>
            <LogList logData={logData} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Dashboard
