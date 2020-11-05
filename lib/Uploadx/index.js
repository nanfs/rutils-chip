import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/row/style";
import _Row from "antd/lib/row";
import "antd/lib/upload/style";
import _Upload from "antd/lib/upload";
import "antd/lib/button/style";
import _Button from "antd/lib/button";
import "antd/lib/col/style";
import _Col from "antd/lib/col";
import "antd/lib/input/style";
import _Input from "antd/lib/input";
import "core-js/modules/es6.regexp.split";
import "antd/lib/message/style";
import _message from "antd/lib/message";
import "core-js/modules/es6.function.name";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import './index.less';

var Uploadx = /*#__PURE__*/function (_React$Component) {
  _inherits(Uploadx, _React$Component);

  var _super = _createSuper(Uploadx);

  function Uploadx() {
    var _this;

    _classCallCheck(this, Uploadx);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      fileList: [],
      value: ''
    };

    _this.handleChange = function (info) {
      var fileChange = _this.props.fileChange;

      var fileList = _toConsumableArray(info.fileList); // 1. Limit the number of uploaded files


      fileList = fileList.slice(-1); // 2. Read from response and show file link

      fileList = fileList.map(function (file) {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }

        _this.setState({
          value: file.name
        });

        return file;
      });

      _this.setState({
        fileList: fileList
      });

      fileChange && fileChange(fileList);
    };

    _this.beforeUpload = function (file, fileList) {
      var _this$props = _this.props,
          fileChange = _this$props.fileChange,
          acceptType = _this$props.acceptType,
          maxSize = _this$props.maxSize,
          checkName = _this$props.checkName;

      if (file.size > maxSize) {
        _message.error('上传文件大小不能超过100M');

        return false;
      }

      if (".".concat(file.name.split('.')[file.name.split('.').length - 1]) !== acceptType) {
        _message.error('上传文件格式错误');

        return false;
      }

      if (checkName && typeof checkName(file.name) === 'string') {
        _message.error(checkName(file.name));

        return false;
      }

      _this.setState({
        fileList: [file],
        value: file.name
      });

      fileChange && fileChange(fileList.slice(-1), file.name);
      return false;
    };

    _this.onUploadChange = function (info) {
      var _this$props2 = _this.props,
          acceptType = _this$props2.acceptType,
          maxSize = _this$props2.maxSize,
          checkName = _this$props2.checkName;

      if (info.file.size > maxSize) {
        return false;
      }

      if (checkName && typeof checkName(info.file.name) === 'string') {
        return false;
      }

      if (".".concat(info.file.name.split('.')[info.file.name.split('.').length - 1]) !== acceptType) {
        return false;
      }

      _this.setState({
        value: info.file.name
      });

      _this.props.onChange(info.file.name);
    };

    _this.inputChange = function (e) {
      var fileNameChange = _this.props.fileNameChange;

      _this.setState({
        value: e.target.value
      });

      fileNameChange && fileNameChange(e.target.value);
    };

    return _this;
  }

  _createClass(Uploadx, [{
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
      var _this$state;

      var _this$props3 = this.props,
          action = _this$props3.action,
          hasInput = _this$props3.hasInput,
          acceptType = _this$props3.acceptType;
      return /*#__PURE__*/React.createElement(_Row, null, /*#__PURE__*/React.createElement(_Col, {
        span: 18,
        hidden: !hasInput
      }, /*#__PURE__*/React.createElement(_Input, {
        style: {
          display: 'inline-block'
        },
        placeholder: "",
        value: (_this$state = this.state) === null || _this$state === void 0 ? void 0 : _this$state.value,
        disabled: true
      })), /*#__PURE__*/React.createElement(_Col, {
        span: 6
      }, /*#__PURE__*/React.createElement(_Upload, {
        className: "uploadx",
        style: {
          display: 'inline-block'
        },
        name: "files",
        fileList: this.state.fileList,
        action: action,
        onChange: this.onUploadChange,
        beforeUpload: this.beforeUpload,
        accept: acceptType
      }, /*#__PURE__*/React.createElement(_Button, {
        type: "primary"
      }, "\u6D4F\u89C8\u6587\u4EF6"))));
    }
  }]);

  return Uploadx;
}(React.Component);

export { Uploadx as default };