import React from 'react'
import { ConnectedRouter } from 'react-router-redux'

import RouteView from './components/RouteView'
import { AuthorizedRoute } from './components/Authorized'
import getRouterConfig from '../config/router'

// eslint-disable-next-line react/display-name
export default ({ history, app }) => {
  const routes = getRouterConfig(app)
  return (
    <ConnectedRouter history={history}>
      <RouteView
        routes={routes}
        renderRoute={props => {
          const { path, authority, component, ...other } = props
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
    </ConnectedRouter>
  )
}
