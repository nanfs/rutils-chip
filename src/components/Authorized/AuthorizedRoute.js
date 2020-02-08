import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Authorized from './Authorized'

export default function AuthorizedRoute(props) {
  const {
    component: Component,
    render,
    authority,
    redirectPath,
    RouteProps,
    user,
    ...other
  } = props
  return (
    <Authorized
      authority={authority}
      noMatch={
        <Route
          {...RouteProps}
          render={() => <Redirect to={{ pathname: redirectPath }} />}
        />
      }
      {...other}
    >
      <Route
        {...RouteProps}
        render={renderProps =>
          Component ? <Component {...renderProps} /> : render(renderProps)
        }
      />
    </Authorized>
  )
}
