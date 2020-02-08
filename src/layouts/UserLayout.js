import React from 'react'
import { Route } from 'react-router'
import RouteView from '../components/RouteView'

export default function UserLayout(props) {
  const { routes } = props
  return (
    <RouteView
      routes={routes}
      renderRoute={routeProps => <Route {...routeProps} />}
    />
  )
}
