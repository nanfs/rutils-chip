import "core-js/modules/es7.object.get-own-property-descriptors";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.keys";
import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/modal/style";
import _Modal from "antd/lib/modal";
import _extends from "@babel/runtime/helpers/extends";
import "antd/lib/button/style";
import _Button from "antd/lib/button";
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.string.includes";
import "antd/lib/notification/style";
import _notification from "antd/lib/notification";
import "core-js/modules/es6.promise";
import "core-js/modules/es6.object.to-string";
import "antd/lib/message/style";
import _message from "antd/lib/message";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import { wrapResponse } from '../utils/tool';
import './index.less';
import classnames from 'classnames';
var ModalCfg_init = {
  forceRender: true,
  // destroyOnClose: true,
  loading: false,
  okText: '确定',
  cancelText: '取消',
  hasFooter: true
};
export function createModalCfg(myCfg) {
  return _objectSpread(_objectSpread({}, ModalCfg_init), myCfg);
}
var formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 7,
      pull: 1
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 14
    }
  }
};

var Modalx = /*#__PURE__*/function (_React$Component) {
  _inherits(Modalx, _React$Component);

  var _super = _createSuper(Modalx);

  function Modalx(props) {
    var _this;

    _classCallCheck(this, Modalx);

    _this = _super.call(this, props);

    _this.show = function () {
      _this.setState({
        show: true
      });
    };

    _this.break = function (error) {
      if (error) {
        _message.error(error.message || error);
      }

      _this.setState({
        submitting: false
      });
    };

    _this.afterClose = function () {
      _this.form && _this.form.resetFields();
    };

    _this.onClose = function () {
      var onClose = _this.props.onClose;

      _this.setState({
        show: false,
        submitting: false
      });

      onClose && onClose();
    };

    _this.afterSubmit = function (res) {
      return new Promise(function (resolve) {
        wrapResponse(res).then(function () {
          _this.setState({
            show: false,
            submitting: false
          });

          _this.props.onSuccess && _this.props.onSuccess();

          _notification.success({
            message: res.message || '操作成功'
          });

          resolve(res);
        }).catch(function (error) {
          _message.error(error.message || error);

          _this.setState({
            submitting: false
          });
        });
      });
    };

    _this.submit = function () {
      var onOk = _this.props.onOk;

      var _ref = _this.formRef && _this.formRef.props || {},
          form = _ref.form;

      _this.setState({
        submitting: true
      });

      if (form && onOk) {
        // 使用回调
        form.validateFieldsAndScroll(function (errors, values) {
          if (!errors) {
            onOk(values);
          } else {
            _this.setState({
              submitting: false
            });
          }
        }).catch(function () {
          _this.setState({
            submitting: false
          });
        });
      } else {
        var status = onOk && onOk();

        if (status === 'noLoading') {
          _this.setState({
            submitting: false
          });
        }
      }
    };

    _this.state = {
      show: false,
      submitting: false
    };
    return _this;
  }

  _createClass(Modalx, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onRef && this.props.onRef(this);
      this.form = this.formRef && this.formRef.props.form || undefined;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.form = this.formRef && this.formRef.props.form || undefined;
    }
  }, {
    key: "hasFormx",
    value: function hasFormx() {
      var _this$props$children, _this$props$children$, _this$props$children$2;

      if ( /*#__PURE__*/React.isValidElement(this.props.children) && this.props.children && ((_this$props$children = this.props.children) === null || _this$props$children === void 0 ? void 0 : (_this$props$children$ = _this$props$children.type) === null || _this$props$children$ === void 0 ? void 0 : (_this$props$children$2 = _this$props$children$.displayName) === null || _this$props$children$2 === void 0 ? void 0 : _this$props$children$2.includes('Form'))) {
        return true;
      }

      return false;
    }
  }, {
    key: "renderContent",
    value: function renderContent(setFormRef) {
      // if (this.state.show) {
      return this.hasFormx() ? /*#__PURE__*/React.cloneElement(this.props.children, {
        onRef: setFormRef,
        submitting: this.state.submitting,
        formItemLayout: this.props.formItemLayout || formItemLayout
      }) : this.props.children; // }
      // return undefined
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var submitting = this.state.submitting;
      var _this$props = this.props,
          modalCfg = _this$props.modalCfg,
          title = _this$props.title;

      var setFormRef = function setFormRef(ref) {
        _this2.formRef = ref;
      };

      var cls = classnames('modalx', this.props.className);
      return /*#__PURE__*/React.createElement(_Modal, _extends({}, modalCfg, {
        visible: this.state.show,
        onCancel: this.onClose,
        onOk: this.onOk,
        afterClose: this.afterClose,
        title: title || modalCfg.title,
        className: cls,
        footer: modalCfg && modalCfg.hasFooter ? [/*#__PURE__*/React.createElement(_Button, {
          key: "back",
          onClick: this.onClose
        }, modalCfg.cancelText), /*#__PURE__*/React.createElement(_Button, {
          key: "submit",
          type: "primary",
          loading: submitting,
          disabled: submitting,
          onClick: this.submit
        }, modalCfg.okText)] : null
      }), this.renderContent(setFormRef));
    }
  }]);

  return Modalx;
}(React.Component);

Modalx.createModalCfg = createModalCfg;
export default Modalx;