import "core-js/modules/es7.object.get-own-property-descriptors";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.keys";
import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/form/style";
import _Form from "antd/lib/form";
import "antd/lib/input/style";
import _Input from "antd/lib/input";
import "antd/lib/message/style";
import _message from "antd/lib/message";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import Formx from '../../Formx';
import Modalx, { createModalCfg } from '../../Modalx';
import { required, checkTreeNodeName, textRange } from '../../utils/valid';

var EditNodeModal = /*#__PURE__*/function (_React$Component) {
  _inherits(EditNodeModal, _React$Component);

  var _super = _createSuper(EditNodeModal);

  function EditNodeModal() {
    var _this;

    _classCallCheck(this, EditNodeModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this.pop = function () {
      _this.modal.show();
    };

    _this.onOk = function (values) {
      var _this$props = _this.props,
          editNodeApiMethod = _this$props.editNodeApiMethod,
          nodeValues = _this$props.nodeValues,
          editNodeSuccess = _this$props.editNodeSuccess;
      var parentId = nodeValues.parentId === '-1' ? null : parseInt(nodeValues.parentId, 10);
      editNodeApiMethod(_objectSpread(_objectSpread({}, values), {}, {
        id: parseInt(nodeValues.id, 10),
        parentId: parentId
      })).then(function (res) {
        if (res.success) {
          editNodeSuccess && editNodeSuccess();
        } else {// this.nodes = []
        }

        _this.modal.afterSubmit(res);
      }).catch(function (error) {
        _message.error(error.message || error);
      });
    };

    return _this;
  }

  _createClass(EditNodeModal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onRef && this.props.onRef(this);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var modalCfg = createModalCfg({
        title: '修改'
      });
      var nodeValues = this.props.nodeValues;
      return /*#__PURE__*/React.createElement(Modalx, {
        onRef: function onRef(ref) {
          _this2.modal = ref;
        },
        modalCfg: modalCfg,
        onOk: this.onOk
      }, /*#__PURE__*/React.createElement(Formx, {
        initValues: nodeValues
      }, /*#__PURE__*/React.createElement(_Form.Item, {
        prop: "name",
        label: "\u540D\u79F0",
        required: true,
        rules: [required, checkTreeNodeName, textRange(0, 20)],
        labelCol: {
          sm: {
            span: 5
          }
        },
        wrapperCol: {
          sm: {
            span: 16
          }
        }
      }, /*#__PURE__*/React.createElement(_Input, {
        placeholder: "\u8F93\u5165\u540D\u79F0"
      }))));
    }
  }]);

  return EditNodeModal;
}(React.Component);

export { EditNodeModal as default };