import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment' // 设置antd时间控件显示为中文
import 'moment/locale/zh-cn'
import Header from '../components/Header'
import RouteView from '../components/RouteView'
import { AuthorizedRoute } from '../components/Authorized'
import styles from './BasicLayout.m.scss'
import './base.scss'

moment.locale('zh-cn')

function BasicLayout(props) {
  const { routes, dispatch } = props
  return (
    <React.Fragment>
      <ConfigProvider locale={zhCN}>
        <Header className={styles.header} dispatch={dispatch} />
        <div className={styles.contentwrap}>
          <div className={styles.banner} />
          <div className="page-content">
            <RouteView
              routes={routes}
              renderRoute={rendProps => {
                const { path, authority, component, ...other } = rendProps
                return (
                  <AuthorizedRoute
                    path={path}
                    authority={authority}
                    component={component}
                    redirectPath="/admin/login"
                    RouteProps={other}
                  />
                )
              }}
            />
          </div>
        </div>
      </ConfigProvider>
    </React.Fragment>
  )
}
export default BasicLayout
