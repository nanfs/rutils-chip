import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/drawer/style";
import _Drawer from "antd/lib/drawer";
import "antd/lib/spin/style";
import _Spin from "antd/lib/spin";
import "antd/lib/icon/style";
import _Icon from "antd/lib/icon";
import "antd/lib/row/style";
import _Row from "antd/lib/row";
import "antd/lib/col/style";
import _Col from "antd/lib/col";
import "antd/lib/button/style";
import _Button from "antd/lib/button";
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.string.includes";
import "antd/lib/message/style";
import _message from "antd/lib/message";
import "antd/lib/notification/style";
import _notification from "antd/lib/notification";
import "core-js/modules/es6.promise";
import "core-js/modules/es6.object.to-string";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { wrapResponse } from '../utils/tool';
import classnames from 'classnames';
import './index.less';

var Drawerx = /*#__PURE__*/function (_React$Component) {
  _inherits(Drawerx, _React$Component);

  var _super = _createSuper(Drawerx);

  function Drawerx(props) {
    var _this;

    _classCallCheck(this, Drawerx);

    _this = _super.call(this, props);

    _this.show = function () {
      _this.setState({
        show: true
      });

      document.body.style.maxHeight = '100vh';
      document.body.style.overflowY = 'hidden';

      if (document.querySelector('.table-wrap')) {
        document.querySelector('.main-wrap').style.padding = '0px';
        document.querySelector('.table-wrap').style.height = 'calc(100vh - 150px)';
        document.querySelector('.table-wrap').style.overflow = 'hidden';
      }

      if (document.querySelector('.ant-drawer-body .ant-form')) {
        document.querySelector('.ant-drawer-body .ant-form').style.Height = 'calc(100vh - 185px)';
      }
    };

    _this.hide = function () {
      var _ref = _this.formRef && _this.formRef.props || {},
          form = _ref.form;

      form && form.resetFields && form.resetFields();

      _this.setState({
        show: false,
        submitting: false
      });

      document.body.style = '';

      if (document.querySelector('.table-wrap')) {
        document.querySelector('.main-wrap').style.padding = '20px';
        document.querySelector('.table-wrap').style = '';
      }

      if (document.querySelector('.ant-drawer-body .ant-form')) {
        document.querySelector('.ant-drawer-body .ant-form').style = '';
      }
    };

    _this.showAndWait = function () {
      _this.setState({
        loading: true
      });

      _this.show();
    };

    _this.finished = function () {
      _this.setState({
        loading: false
      });
    };

    _this.onClose = function () {
      _this.hide();

      var onClose = _this.props.onClose;
      onClose && onClose();
    };

    _this.afterSubmit = function (res) {
      var _ref2 = _this.formRef && _this.formRef.props || {},
          form = _ref2.form;

      return new Promise(function (resolve) {
        wrapResponse(res).then(function () {
          _this.hide();

          _this.props.onSuccess && _this.props.onSuccess();

          _notification.success({
            message: res.message || '操作成功'
          });

          resolve(res);
          form.resetFields();
        }).catch(function () {
          console.log(res.message, res);

          _message.error(res.message || '操作失败');

          _this.setState({
            submitting: false
          });
        });
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

    _this.submit = function () {
      var onOk = _this.props.onOk;

      var _ref3 = _this.formRef && _this.formRef.props || {},
          form = _ref3.form;

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
        onOk && onOk();
      }
    };

    _this.state = {
      show: false,
      submitting: false
    };
    return _this;
  }

  _createClass(Drawerx, [{
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
    key: "renderOption",
    value: function renderOption() {
      if (this.hasFormx()) {
        return /*#__PURE__*/React.createElement(_Row, {
          className: "option-wrap"
        }, /*#__PURE__*/React.createElement(_Col, {
          span: 6,
          push: 18
        }, /*#__PURE__*/React.createElement(_Button, {
          key: "back",
          onClick: this.onClose
        }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(_Button, {
          key: "submit",
          type: "primary",
          disabled: this.state.submitting,
          loading: this.state.submitting,
          onClick: this.submit
        }, "\u786E\u5B9A")));
      }

      return undefined;
    }
  }, {
    key: "renderContent",
    value: function renderContent(setFormRef, show) {
      // if (this.state.show) {
      return this.hasFormx() ? /*#__PURE__*/React.cloneElement(this.props.children, {
        onRef: setFormRef,
        submitting: this.state.submitting,
        isParentShow: show
      }) : /*#__PURE__*/React.cloneElement(this.props.children, {
        isParentShow: show
      }); // }
      // return undefined
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var title = this.props.title;

      var setFormRef = function setFormRef(ref) {
        _this2.formRef = ref;
      };

      var antIcon = /*#__PURE__*/React.createElement(_Icon, {
        type: "loading",
        style: {
          fontSize: 24
        },
        spin: true
      });
      var cls = classnames('drawerx', this.props.className);
      return /*#__PURE__*/React.createElement(_Drawer, {
        closable: false,
        getContainer: false,
        width: '100%',
        placement: "right",
        visible: this.state.show,
        onClose: this.onClose,
        title: title,
        style: {
          position: 'absolute'
        },
        className: cls
      }, /*#__PURE__*/React.createElement(_Spin, {
        indicator: antIcon,
        wrapperClassName: "no-position",
        spinning: this.state.submitting || !!this.state.loading,
        tip: "\u6B63\u5728\u5904\u7406!\u8BF7\u7A0D\u540E"
      }, this.renderContent(setFormRef, this.state.show), this.renderOption()));
    }
  }]);

  return Drawerx;
}(React.Component);

export default Drawerx;