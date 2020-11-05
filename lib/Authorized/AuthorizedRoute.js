import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { checkRoute } from '@/utils/checkPermissions';

function Authorized(props) {
  var children = props.children,
      authority = props.authority,
      _props$noMatch = props.noMatch,
      noMatch = _props$noMatch === void 0 ? null : _props$noMatch;
  var childrenRender = typeof children === 'undefined' ? null : children;
  return checkRoute(authority, childrenRender, noMatch);
}

export default function AuthorizedRoute(props) {
  var Component = props.component,
      _render = props.render,
      authority = props.authority,
      redirectPath = props.redirectPath,
      RouteProps = props.RouteProps,
      user = props.user,
      other = _objectWithoutProperties(props, ["component", "render", "authority", "redirectPath", "RouteProps", "user"]);

  return /*#__PURE__*/React.createElement(Authorized, _extends({
    authority: authority,
    noMatch: /*#__PURE__*/React.createElement(Route, _extends({}, RouteProps, {
      render: function render() {
        return /*#__PURE__*/React.createElement(Redirect, {
          to: {
            pathname: redirectPath
          }
        });
      }
    }))
  }, other), /*#__PURE__*/React.createElement(Route, _extends({}, RouteProps, {
    render: function render(renderProps) {
      return Component ? /*#__PURE__*/React.createElement(Component, renderProps) : _render(renderProps);
    }
  })));
}