import "antd/lib/button/style";
import _Button from "antd/lib/button";
import React from 'react';
import './index.less';
export default function InnerPath(props) {
  var inner = props.inner,
      location = props.location,
      onBack = props.onBack,
      children = props.children,
      description = props.description;

  if (!inner) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "inner-path"
    }, location, children), description && /*#__PURE__*/React.createElement("h3", {
      className: "col-description"
    }, description));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "inner-path has-inner"
  }, /*#__PURE__*/React.createElement(_Button, {
    onClick: onBack,
    icon: "left"
  }), /*#__PURE__*/React.createElement("span", {
    className: "inner-text"
  }, inner), /*#__PURE__*/React.createElement("span", {
    className: "location-text"
  }, " < ", location));
}