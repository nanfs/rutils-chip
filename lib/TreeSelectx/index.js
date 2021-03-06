import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/tree-select/style";
import _TreeSelect from "antd/lib/tree-select";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { nodes2Tree } from '../utils/tool';

var TreeSelectx = /*#__PURE__*/function (_React$Component) {
  _inherits(TreeSelectx, _React$Component);

  var _super = _createSuper(TreeSelectx);

  function TreeSelectx() {
    var _this;

    _classCallCheck(this, TreeSelectx);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      searchValue: '',
      autoExpandParent: true,
      expandedKeys: [],
      nodeList: [],
      loadding: true,
      treeData: []
    };
    return _this;
  }

  _createClass(TreeSelectx, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prep) {
      if (this.props.nodeData !== prep.nodeData) {
        var treeData = nodes2Tree(this.props.nodeData);
        this.setState({
          treeData: treeData
        });
      }

      if (this.props.value !== prep.value) {
        this.setState({
          value: this.props.value
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var treeData = this.state.treeData;
      var _this$props = this.props,
          _this$props$placehold = _this$props.placeholder,
          placeholder = _this$props$placehold === void 0 ? '请选择' : _this$props$placehold,
          _this$props$onChange = _this$props.onChange,
          onChange = _this$props$onChange === void 0 ? undefined : _this$props$onChange,
          disabled = _this$props.disabled;
      return /*#__PURE__*/React.createElement(_TreeSelect, {
        style: {
          width: '100%'
        },
        dropdownStyle: {
          maxHeight: 400,
          overflow: 'auto'
        },
        placeholder: placeholder,
        treeDefaultExpandAll: true // showSearch={true}
        ,
        treeData: treeData,
        onChange: onChange,
        value: this.state.value,
        disabled: disabled
      });
    }
  }]);

  return TreeSelectx;
}(React.Component);

export { TreeSelectx as default };