import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/select/style";
import _Select from "antd/lib/select";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import "antd/lib/input/style";
import _Input from "antd/lib/input";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
var Search = _Input.Search,
    Group = _Input.Group;

var SelectSearch = /*#__PURE__*/function (_React$Component) {
  _inherits(SelectSearch, _React$Component);

  var _super = _createSuper(SelectSearch);

  function SelectSearch() {
    var _this$props, _this$props2, _this$props2$options$;

    var _this;

    _classCallCheck(this, SelectSearch);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      value: ((_this$props = _this.props) === null || _this$props === void 0 ? void 0 : _this$props.defaultValue) || '',
      searchKey: ((_this$props2 = _this.props) === null || _this$props2 === void 0 ? void 0 : (_this$props2$options$ = _this$props2.options[0]) === null || _this$props2$options$ === void 0 ? void 0 : _this$props2$options$.value) || ''
    };

    _this.onSelectChange = function (searchKey) {
      var _this$state;

      var onSearch = _this.props.onSearch;
      var oldKey = _this.state.searchKey;

      _this.setState({
        searchKey: searchKey
      });

      _this.props.onSelectChange && _this.props.onSelectChange(oldKey, searchKey);
      onSearch && onSearch(searchKey, (_this$state = _this.state) === null || _this$state === void 0 ? void 0 : _this$state.value);
    };

    _this.onChange = function (e) {
      _this.setState({
        value: e.target.value
      });
    };

    _this.onSearch = function (value) {
      var _this$state2;

      var onSearch = _this.props.onSearch;
      onSearch && onSearch((_this$state2 = _this.state) === null || _this$state2 === void 0 ? void 0 : _this$state2.searchKey, value);
    };

    return _this;
  }

  _createClass(SelectSearch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onRef && this.props.onRef(this);
    }
  }, {
    key: "reset",
    value: function reset() {
      var options = this.props.options;
      var searchKey = options && options[0] && options[0].value || '';
      this.setState({
        value: '',
        searchKey: searchKey
      });
    }
    /**
     * oldKey 是为了删除搜索字段
     *
     * @memberof SelectSearch
     */

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          placeholder = _this$props3.placeholder,
          options = _this$props3.options;
      var _this$state3 = this.state,
          searchKey = _this$state3.searchKey,
          value = _this$state3.value;
      return /*#__PURE__*/React.createElement(Group, {
        className: "select-search"
      }, /*#__PURE__*/React.createElement(_Select, {
        onChange: function onChange(key) {
          return _this2.onSelectChange(key);
        },
        value: searchKey
      }, options && options.map(function (option) {
        return /*#__PURE__*/React.createElement(_Select.Option, {
          key: option.value,
          value: option.value,
          title: option.label,
          disabled: option.disabled
        }, option.label);
      })), /*#__PURE__*/React.createElement(Search, {
        placeholder: placeholder || '请输入',
        onSearch: this.onSearch,
        onChange: this.onChange,
        value: value,
        enterButton: true
      }));
    }
  }]);

  return SelectSearch;
}(React.Component);

export default SelectSearch;