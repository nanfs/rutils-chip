import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import React from 'react';
import classnames from 'classnames';
import './fonts/iconfont';
import './fonts/iconfont.css';
import './icon.less';

function onClick(props) {
  if (props.disabled) {
    return false;
  } else {
    props.onClick && props.onClick();
  }
}

function MyIcon(props) {
  var _classes;

  var _props$prefixCls = props.prefixCls,
      prefixCls = _props$prefixCls === void 0 ? 'v-icon anticon' : _props$prefixCls,
      spin = props.spin,
      _props$component = props.component,
      component = _props$component === void 0 ? 'svg' : _props$component,
      title = props.title,
      className = props.className,
      other = _objectWithoutProperties(props, ["prefixCls", "spin", "component", "title", "className"]);

  var type = props.type || 'vm-unknown';
  var classes = (_classes = {}, _defineProperty(_classes, "icon-".concat(type), type), _defineProperty(_classes, 'v-icon-spin', !!spin), _classes);

  if (component === 'svg') {
    var _cls = classnames('svgicon', "icon-".concat(type), className);

    var svgType = "#icon-".concat(type);
    return /*#__PURE__*/React.createElement("i", {
      className: prefixCls,
      title: title
    }, /*#__PURE__*/React.createElement("svg", _extends({
      className: _cls,
      "aria-hidden": "true"
    }, other, {
      onClick: onClick.bind(this, props)
    }), /*#__PURE__*/React.createElement("use", {
      xlinkHref: svgType
    })));
  }

  var cls = classnames(prefixCls, 'iconfont', className, classes);
  return /*#__PURE__*/React.createElement("i", _extends({}, other, {
    className: cls,
    title: title,
    onClick: onClick.bind(this, props)
  }));
}

export default MyIcon;