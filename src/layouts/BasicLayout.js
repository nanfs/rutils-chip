import React from 'react'
import { ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import dayjs from 'dayjs' // 设置antd时间控件显示为中文
import 'dayjs/locale/zh-cn'
import RouteView from '@/components/RouteView'
import { AuthorizedRoute } from '@/components/Authorized'
import './base.less'
import Header from './Header'
import Sider from './Sider'
import ShortcutDrawer from './ShortcutDrawer'
import { subMenu } from '*/menu'

const { Content, Footer } = Layout
// import ProLayout from '@ant-design/pro-layout'

dayjs.locale('zh-cn')

class BasicLayout extends React.Component {
  state = {
    visible: false
  }

  render() {
    const { location } = this.props
    return (
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header history={this.props.history} />
          <Layout>
            <Sider path={location.pathname} />
            <Layout>
              <Content
                className={subMenu.includes(location.pathname) && 'has-submenu'}
              >
                <Layout className="main-wrap">
                  <RouteView
                    routes={this.props.routes}
                    renderRoute={props => {
                      const { path, authority, component, ...other } = props
                      return (
                        <AuthorizedRoute
                          path={path}
                          authority={authority}
                          component={component}
                          redirectPath={'/dashboard'}
                          RouteProps={other}
                        />
                      )
                    }}
                  />
                  {/* <ShortcutDrawer></ShortcutDrawer> */}
                </Layout>
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
export default BasicLayout
