import "core-js/modules/es7.object.get-own-property-descriptors";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.object.keys";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import MyIcon from '../MyIcon';
import { NavLink } from 'react-router-dom';
import './index.less';

function Diliver(props) {
  var heigth = props.heigth;
  return /*#__PURE__*/React.createElement("div", {
    className: "drawer-form-diliver diliver",
    style: {
      height: heigth || '15px'
    }
  });
}

function Title(props) {
  var slot = props.slot;
  return /*#__PURE__*/React.createElement("p", {
    className: "drawer-form-title"
  }, /*#__PURE__*/React.createElement("span", null, slot), props.children && React.Children.map(props.children, function (child) {
    return child && /*#__PURE__*/React.cloneElement(child, {});
  }));
}

function TitleInfo(props) {
  var slot = props.slot,
      more = props.more,
      url = props.url,
      style = props.style;
  return /*#__PURE__*/React.createElement("p", {
    style: _objectSpread({}, style),
    className: "table-title"
  }, /*#__PURE__*/React.createElement(MyIcon, {
    type: "sd",
    component: "svg",
    style: {
      fontSize: '30px',
      verticalAlign: 'middle'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      verticalAlign: 'middle'
    }
  }, slot), url && /*#__PURE__*/React.createElement(NavLink, {
    to: url
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      float: 'right',
      paddingRight: 10,
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '26px'
    }
  }, more)));
}

export { TitleInfo, Title, Diliver };