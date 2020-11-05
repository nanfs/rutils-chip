import "core-js/modules/es7.object.get-own-property-descriptors";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.object.keys";
import "antd/lib/popover/style";
import _Popover from "antd/lib/popover";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import MyIcon from '../MyIcon';
import './index.less';

function Reminder(props) {
  var _props$placement = props.placement,
      placement = _props$placement === void 0 ? 'right' : _props$placement,
      tips = props.tips,
      style = props.style,
      iconStyle = props.iconStyle;
  return /*#__PURE__*/React.createElement("span", {
    style: _objectSpread({
      marginLeft: 5
    }, style),
    className: "reminder"
  }, /*#__PURE__*/React.createElement(_Popover, {
    placement: placement,
    content: tips,
    trigger: "hover",
    className: "reminder-popover"
  }, /*#__PURE__*/React.createElement(MyIcon, {
    type: "vm-unknown",
    component: "svg",
    style: _objectSpread({
      fontSize: '24px',
      verticalAlign: 'text-bottom',
      color: '#1890ff'
    }, iconStyle)
  })));
}

export default Reminder;