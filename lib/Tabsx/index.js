import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/tabs/style";
import _Tabs from "antd/lib/tabs";
import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';

var Tabsx = /*#__PURE__*/function (_React$Component) {
  _inherits(Tabsx, _React$Component);

  var _super = _createSuper(Tabsx);

  function Tabsx() {
    var _this;

    _classCallCheck(this, Tabsx);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      activeKey: ''
    };
    return _this;
  }

  _createClass(Tabsx, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          children = _this$props.children,
          defaultActiveKey = _this$props.defaultActiveKey,
          prop = _objectWithoutProperties(_this$props, ["children", "defaultActiveKey"]);

      var activeKey = this.state.activeKey;
      var currentKey = defaultActiveKey && activeKey ? activeKey.substr(2) : defaultActiveKey;
      return /*#__PURE__*/React.createElement(_Tabs, _extends({
        defaultActiveKey: defaultActiveKey || activeKey
      }, prop, {
        onTabClick: function onTabClick(key) {
          _this2.setState({
            activeKey: key
          });
        }
      }), React.Children.map(children, function (child) {
        if (!child) return;

        if (child.key === currentKey) {
          return /*#__PURE__*/React.cloneElement(child);
        } else {
          return /*#__PURE__*/React.cloneElement(child, {
            children: null
          });
        }
      }));
    }
  }]);

  return Tabsx;
}(React.Component);

export { Tabsx as default };