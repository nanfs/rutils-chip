import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/row/style";
import _Row from "antd/lib/row";
import "antd/lib/input-number/style";
import _InputNumber from "antd/lib/input-number";
import "antd/lib/col/style";
import _Col from "antd/lib/col";
import "antd/lib/slider/style";
import _Slider from "antd/lib/slider";
import "core-js/modules/es6.regexp.constructor";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import './index.less';

var SliderNumberx = /*#__PURE__*/function (_React$Component) {
  _inherits(SliderNumberx, _React$Component);

  var _super = _createSuper(SliderNumberx);

  function SliderNumberx() {
    var _this;

    _classCallCheck(this, SliderNumberx);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this.handleChange = function (value) {
      var re = new RegExp('^(\\-)?([1-9]{1}[0-9]*|[0-9])$');

      if (re.test(value)) {
        _this.setState({
          value: value
        });

        _this.props.onChange(value);
      }
    };

    return _this;
  }

  _createClass(SliderNumberx, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prep) {
      if (this.props.value !== prep.value) {
        this.setState({
          value: this.props.value
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state, _this$state2;

      var _this$props = this.props,
          hasInputNumber = _this$props.hasInputNumber,
          disabled = _this$props.disabled,
          min = _this$props.min,
          max = _this$props.max,
          step = _this$props.step,
          formatter = _this$props.formatter,
          parser = _this$props.parser;
      return /*#__PURE__*/React.createElement(_Row, null, /*#__PURE__*/React.createElement(_Col, {
        span: hasInputNumber ? 15 : 24
      }, /*#__PURE__*/React.createElement(_Slider, {
        min: min,
        max: max,
        step: step,
        disabled: disabled,
        onChange: this.handleChange,
        value: (_this$state = this.state) === null || _this$state === void 0 ? void 0 : _this$state.value
      })), /*#__PURE__*/React.createElement(_Col, {
        span: 8,
        push: 1,
        hidden: !hasInputNumber
      }, /*#__PURE__*/React.createElement(_InputNumber, {
        min: min,
        max: max,
        step: step,
        formatter: formatter,
        parser: parser,
        disabled: disabled,
        onChange: this.handleChange,
        value: (_this$state2 = this.state) === null || _this$state2 === void 0 ? void 0 : _this$state2.value
      })));
    }
  }]);

  return SliderNumberx;
}(React.Component);

export { SliderNumberx as default };