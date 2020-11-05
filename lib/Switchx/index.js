import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/radio/style";
import _Radio from "antd/lib/radio";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';

var Switchx = /*#__PURE__*/function (_React$Component) {
  _inherits(Switchx, _React$Component);

  var _super = _createSuper(Switchx);

  function Switchx() {
    var _this;

    _classCallCheck(this, Switchx);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      value: undefined
    };

    _this.handleChange = function (e) {
      _this.setState({
        value: e.target.value
      });

      _this.props.onChange(e.target.value);
    };

    return _this;
  }

  _createClass(Switchx, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prep) {
      if (this.props.value !== prep.value && prep.value === undefined) {
        this.setState({
          value: this.props.value
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          options = _this$props.options,
          disabled = _this$props.disabled;
      var optionsValue = options || [{
        label: 'on',
        value: 'on'
      }, {
        label: 'off',
        value: 'off'
      }];
      return /*#__PURE__*/React.createElement(_Radio.Group, {
        disabled: disabled,
        buttonStyle: "solid",
        onChange: this.handleChange,
        value: this.state.value,
        className: "switch-wrap"
      }, optionsValue.map(function (item) {
        return /*#__PURE__*/React.createElement(_Radio.Button, {
          value: item.value,
          key: item.value
        }, item.label);
      }));
    }
  }]);

  return Switchx;
}(React.Component);

export { Switchx as default };