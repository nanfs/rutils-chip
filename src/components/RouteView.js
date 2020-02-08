import React from 'react'
import { Switch, Redirect } from 'react-router'

function RouteView({ routes: routerArr, renderRoute: RenderRoute }) {
  return (
    <Switch>
      {routerArr
        .filter(route => route.routes)
        .map(route => {
          return (
            <Redirect
              key={`redirect${route.path}`}
              exact
              from={route.path}
              to={route.routes[0].path}
            />
          )
        })}
      {routerArr.map(route => {
        const { component: Component, routes, ...other } = route
        const routeComponetProp = !routes
          ? Component
          : props => (
              // props 代表Route props { match, location, history }
              <Component routes={routes} {...props} />
            )

        const routeProps = {
          ...other,
          component: routeComponetProp,
          exact: !routes
        }
        return <RenderRoute key={route.path} {...routeProps} />
      })}
      <Redirect to="/work/task" />
    </Switch>
  )
}

export default RouteView
