import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/icon/style";
import _Icon from "antd/lib/icon";
import "antd/lib/button/style";
import _Button from "antd/lib/button";
import "antd/lib/input-number/style";
import _InputNumber from "antd/lib/input-number";
import _extends from "@babel/runtime/helpers/extends";
import "antd/lib/radio/style";
import _Radio from "antd/lib/radio";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import classnames from 'classnames';
import './index.less';

var Radiox = /*#__PURE__*/function (_React$Component) {
  _inherits(Radiox, _React$Component);

  var _super = _createSuper(Radiox);

  function Radiox() {
    var _this;

    _classCallCheck(this, Radiox);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this.handleChange = function (e) {
      var value = (e === null || e === void 0 ? void 0 : e.target) ? e.target.value : e;

      _this.setState({
        value: value
      });

      _this.props.onChange(value);
    };

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

    _this.toggle = function () {
      var _this$state;

      _this.setState({
        expand: !((_this$state = _this.state) === null || _this$state === void 0 ? void 0 : _this$state.expand)
      });
    };

    _this.renderOptions = function () {
      var _this$state2;

      var _this$props = _this.props,
          options = _this$props.options,
          showExpand = _this$props.showExpand;

      if (!options || !options.length) {
        return /*#__PURE__*/React.createElement("span", null, "\u6682\u65E0\u6570\u636E");
      }

      if (((_this$state2 = _this.state) === null || _this$state2 === void 0 ? void 0 : _this$state2.expand) || !showExpand) {
        return options.map(function (item) {
          return /*#__PURE__*/React.createElement(_Radio.Button, {
            value: item.value,
            key: item.value,
            disabled: item.disabled
          }, item.label);
        });
      }

      var someOptions = options.slice(0, 8);
      return someOptions.map(function (item) {
        return /*#__PURE__*/React.createElement(_Radio.Button, {
          value: item.value,
          key: item.value,
          disabled: item.disabled
        }, item.label);
      });
    };

    return _this;
  }

  _createClass(Radiox, [{
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
      var _this$state3, _this$state4, _this$state5, _this$state6, _this$state7, _this$state8;

      var _this$props2 = this.props,
          className = _this$props2.className,
          hasInputNumber = _this$props2.hasInputNumber,
          loading = _this$props2.loading,
          getData = _this$props2.getData,
          numProps = _this$props2.numProps,
          disabled = _this$props2.disabled,
          options = _this$props2.options,
          showExpand = _this$props2.showExpand;
      var cls = classnames(className, 'radiox', getData && 'has-fresh');
      return /*#__PURE__*/React.createElement(_Radio.Group, {
        className: cls,
        disabled: disabled,
        onChange: this.handleChange,
        value: (_this$state3 = this.state) === null || _this$state3 === void 0 ? void 0 : _this$state3.value
      }, this.renderOptions(), hasInputNumber && /*#__PURE__*/React.createElement(_InputNumber, _extends({
        placeholder: ""
      }, numProps, {
        disabled: disabled,
        onChange: this.handleChange,
        value: (_this$state4 = this.state) === null || _this$state4 === void 0 ? void 0 : _this$state4.value,
        formatter: function formatter(value) {
          return "".concat(value);
        },
        parser: function parser(value) {
          return value;
        }
      })), showExpand && options && options.length > 8 && /*#__PURE__*/React.createElement(_Button, {
        className: "expand-btn",
        onClick: this.toggle,
        disabled: disabled,
        icon: ((_this$state5 = this.state) === null || _this$state5 === void 0 ? void 0 : _this$state5.expand) ? 'up' : 'down'
      }, ((_this$state6 = this.state) === null || _this$state6 === void 0 ? void 0 : _this$state6.expand) ? '折叠隐藏' : '展开更多'), getData && /*#__PURE__*/React.createElement(_Button, {
        className: "reload-btn",
        disabled: disabled || ((_this$state7 = this.state) === null || _this$state7 === void 0 ? void 0 : _this$state7.loading),
        onClick: this.handleGetData
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "sync",
        spin: loading || ((_this$state8 = this.state) === null || _this$state8 === void 0 ? void 0 : _this$state8.loading)
      })));
    }
  }]);

  return Radiox;
}(React.Component);

export { Radiox as default };