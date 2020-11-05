import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/button/style";
import _Button from "antd/lib/button";
import "antd/lib/icon/style";
import _Icon from "antd/lib/icon";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import "antd/lib/select/style";
import _Select from "antd/lib/select";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import classnames from 'classnames';
import './index.less';
var Option = _Select.Option;

var Selectx = /*#__PURE__*/function (_React$Component) {
  _inherits(Selectx, _React$Component);

  var _super = _createSuper(Selectx);

  function Selectx() {
    var _this;

    _classCallCheck(this, Selectx);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.handleGetData = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var getData;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({
                loading: true
              });

              getData = _this.props.getData;
              _context.prev = 2;
              _context.next = 5;
              return getData();

            case 5:
              _this.setState({
                loading: false
              });

              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);

              _this.setState({
                loading: false
              });

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 8]]);
    }));

    _this.handleChange = function (value) {
      _this.setState({
        value: value
      });

      _this.props.onChange(value);
    };

    return _this;
  }

  _createClass(Selectx, [{
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
      var _this$state, _this$state2, _this$state3;

      var _this$props = this.props,
          className = _this$props.className,
          _this$props$options = _this$props.options,
          options = _this$props$options === void 0 ? [] : _this$props$options,
          _this$props$mode = _this$props.mode,
          mode = _this$props$mode === void 0 ? '' : _this$props$mode,
          getData = _this$props.getData,
          disabled = _this$props.disabled,
          style = _this$props.style,
          children = _this$props.children,
          _this$props$showRefre = _this$props.showRefresh,
          showRefresh = _this$props$showRefre === void 0 ? true : _this$props$showRefre,
          _this$props$placehold = _this$props.placeholder,
          placeholder = _this$props$placehold === void 0 ? '请选择' : _this$props$placehold;
      var cls = classnames(className, 'selectx', getData && 'has-fresh');
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Select, {
        className: cls,
        mode: mode,
        style: style,
        disabled: disabled,
        placeholder: placeholder,
        onChange: this.handleChange,
        value: (_this$state = this.state) === null || _this$state === void 0 ? void 0 : _this$state.value
      }, children, options === null || options === void 0 ? void 0 : options.map(function (item) {
        return /*#__PURE__*/React.createElement(Option, {
          value: item.value,
          key: item.value,
          disabled: item.disabled
        }, item.label);
      })), getData && showRefresh && /*#__PURE__*/React.createElement(_Button, {
        className: "reload-btn",
        disabled: disabled || ((_this$state2 = this.state) === null || _this$state2 === void 0 ? void 0 : _this$state2.loading),
        onClick: this.handleGetData
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "sync",
        spin: (_this$state3 = this.state) === null || _this$state3 === void 0 ? void 0 : _this$state3.loading
      })));
    }
  }]);

  return Selectx;
}(React.Component);

export { Selectx as default };