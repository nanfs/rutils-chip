import React from 'react'
import { ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment' // 设置antd时间控件显示为中文
import 'moment/locale/zh-cn'
import { connect } from 'react-redux'
import RouteView from '@/components/RouteView'
import { AuthorizedRoute } from '@/components/Authorized'
import './base.less'
import Header from './Header'
import Sider from './Sider'

const { Content, Footer } = Layout
// import ProLayout from '@ant-design/pro-layout'

moment.locale('zh-cn')

class BasicLayout extends React.Component {
  render() {
    const { location, isSideFold, dispatch } = this.props

    return (
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header history={this.props.history} />
          <Layout>
            <Sider
              path={location.pathname}
              collapsed={isSideFold}
              dispatch={dispatch}
            />
            <Layout>
              <Content>
                <RouteView
                  routes={this.props.routes}
                  renderRoute={props => {
                    const { path, authority, component, ...other } = props
                    return (
                      <AuthorizedRoute
                        path={path}
                        authority={authority}
                        component={component}
                        redirectPath="/dashboard"
                        RouteProps={other}
                      />
                    )
                  }}
                />
              </Content>
              <Footer style={{ textAlign: 'center', display: 'none' }}>
                版权所有©2020 电科云（北京）科技有限公司
              </Footer>
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    )
  }
}
export default connect(({ app }) => {
  const { isSideFold } = app
  return {
    isSideFold
  }
})(BasicLayout)
