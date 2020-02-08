import React from 'react'
import { ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment' // 设置antd时间控件显示为中文
import 'moment/locale/zh-cn'
import RouteView from '@/components/RouteView'
import { AuthorizedRoute } from '@/components/Authorized'
import './base.scss'
import Header from './Header'
import Sider from './Sider'

const { Content, Footer } = Layout
// import ProLayout from '@ant-design/pro-layout'

moment.locale('zh-cn')

export default class BasicLayout extends React.Component {
  render() {
    return (
      // const { routes, dispatch } = props
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Layout>
            <Sider path={this.props.location.pathname} />
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
              <Footer style={{ textAlign: 'center' }}>
                中国电科云版权所有
              </Footer>
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    )
  }
}
