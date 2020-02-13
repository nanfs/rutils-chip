import React from 'react'
import { message, Row, Col } from 'antd'
import TitleInfo from '@/components/Title/TitleInfo'
import LogList from './chip/LogList'
import DonutChart from './chip/DonutChart'
import LineChart from './chip/LineChart'
import './index.scss'
import tclogsApi from '@/services/tclogs'

class Dashboard extends React.Component {
  componentDidMount() {
    tclogsApi
      .list()
      .then(res => {
        if (res.success) {
          if (res.data) {
            this.setState({
              logData: res.data.list
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
    logData: []
  }

  render() {
    const { logData } = this.state
    return (
      <React.Fragment>
        <div className="dashboard-wrap">
          <div className="dashboard-charts">
            <Row>
              <Col span={12} style={{ paddingRight: 20, marginBottom: 20 }}>
                <div className="dashboard-chart-wrap">
                  <div className="dashboard-chart-title">
                    <TitleInfo slot="桌面" more="更多&gt;" />
                  </div>
                  <DonutChart
                    guideTitle="桌面统计"
                    dataSum="300"
                    DonutChartData={[]}
                  />
                  <LineChart lineChartData={[]} />
                </div>
              </Col>
              <Col span={12} className="dashboard-chart-wrap">
                <div className="dashboard-chart-title">
                  <TitleInfo slot="桌面池" more="更多&gt;" />
                </div>
                <DonutChart
                  guideTitle="桌面池统计"
                  dataSum="300"
                  DonutChartData={[]}
                />
                <LineChart lineChartData={[]} />
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ paddingRight: 20 }}>
                <div className="dashboard-chart-wrap">
                  <div className="dashboard-chart-title">
                    <TitleInfo slot="终端" more="更多&gt;" />
                  </div>
                  <DonutChart
                    guideTitle="终端统计"
                    dataSum="300"
                    DonutChartData={[]}
                  />
                  <LineChart lineChartData={[]} />
                </div>
              </Col>
              <Col span={12} className="dashboard-chart-wrap">
                <div className="dashboard-chart-title">
                  <TitleInfo slot="用户" more="更多&gt;" />
                </div>
                <DonutChart
                  guideTitle="用户统计"
                  dataSum="300"
                  DonutChartData={[]}
                />
                <LineChart lineChartData={[]} />
              </Col>
            </Row>
          </div>
          <div className="dashboard-tclog">
            <div className="dashboard-tclog-title">
              {/* <span className="dashboard-tclog-title-text">日志</span> */}
              <TitleInfo slot="日志" more="更多&gt;" />
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
