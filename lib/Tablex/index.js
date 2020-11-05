import "core-js/modules/es7.object.get-own-property-descriptors";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.keys";
import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/pagination/style";
import _Pagination from "antd/lib/pagination";
import "antd/lib/button/style";
import _Button from "antd/lib/button";
import "antd/lib/table/style";
import _Table from "antd/lib/table";
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.string.includes";
import "core-js/modules/es6.regexp.replace";
import "core-js/modules/es6.regexp.search";
import "antd/lib/message/style";
import _message from "antd/lib/message";
import "core-js/modules/es6.promise";
import "core-js/modules/es6.object.to-string";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import "antd/lib/select/style";
import _Select from "antd/lib/select";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* eslint-disable no-nested-ternary */
import React from 'react';
import { Resizable } from 'react-resizable';
import { wrapResponse } from '../utils/tool';
import './index.less';
import TableWrap, { BarLeft, BarRight, ToolBar } from './TableWrap';
var Option = _Select.Option;
var tableCfg_init = {
  data: [],
  columns: undefined,
  loading: true,
  noDataText: undefined,
  // 必填，定义获取表格数据接口
  apiMethod: undefined,
  renderMethod: undefined,
  // 选填，表格中rowKey定义，默认为id
  rowKey: 'id',
  // 选填，设置表格数据请求参数
  searchs: {},
  locale: {
    filterReset: '清空'
  },
  // 选填，设置表格是否可选择，默认可选
  hasRowSelection: true,
  // 选填，设置表格选择，一般为空数组
  selection: [],
  // 是否显示页码 默认显示
  hasPaging: true,
  // 自动刷新时间选项 以\秒\为单位
  replaceTimeOptions: ['5', '10', '20'],
  pageSizeOptions: ['5', '10', '20', '50'],
  // 选填, 是否自动请求表格数据
  autoFetch: true,
  // 选填，在请求发送前，处理请求参数方法，return 处理后的请求数据对象
  handleRequestMethod: undefined,
  // 选填, 扩展行显示
  expandedRowRender: undefined,
  // 选填, 是否自动刷新
  autoReplace: false,
  // 选填, 每次自动刷新结束后执行的函数
  autoCallback: undefined,
  // 选填, 缓存所选
  keepSelection: false,
  // 选填, 表格是否可以Resize
  isResize: false
};
export function createTableCfg(myCfg) {
  return _objectSpread(_objectSpread({}, tableCfg_init), myCfg);
} // 可以拖动Resize

var ResizableTitle = function ResizableTitle(props) {
  var onResize = props.onResize,
      width = props.width,
      restProps = _objectWithoutProperties(props, ["onResize", "width"]);

  if (!width) {
    return /*#__PURE__*/React.createElement("th", restProps);
  }

  return /*#__PURE__*/React.createElement(Resizable, {
    width: width,
    height: 0,
    handle: /*#__PURE__*/React.createElement("span", {
      className: "react-resizable-handle",
      onClick: function onClick(e) {
        e.stopPropagation();
      }
    }),
    onResize: onResize,
    draggableOpts: {
      enableUserSelectHack: false
    }
  }, /*#__PURE__*/React.createElement("th", restProps));
}; // tablex 中加载状态 。searchs  selection 都有外部维护


var Tablex = /*#__PURE__*/function (_React$Component) {
  _inherits(Tablex, _React$Component);

  var _super = _createSuper(Tablex);

  function Tablex(props) {
    var _this;

    _classCallCheck(this, Tablex);

    _this = _super.call(this, props);
    _this.components = {
      header: {
        cell: ResizableTitle
      }
    };

    _this.handleResize = function (index) {
      return function (e, _ref) {
        var size = _ref.size;

        _this.setState(function (_ref2) {
          var columns = _ref2.columns;

          var nextColumns = _toConsumableArray(columns);

          var columnsWidth = _this.state.columnsWidth;
          var _columns$index = columns[index],
              maxWidth = _columns$index.maxWidth,
              minWidth = _columns$index.minWidth;
          var width = size.width < minWidth ? minWidth : size.width > maxWidth ? maxWidth : size.width;
          nextColumns[index] = _objectSpread(_objectSpread({}, nextColumns[index]), {}, {
            width: width
          }); // 保存对应栏目的宽度

          columnsWidth[columns[index].dataIndex] = width;

          _this.setState({
            columnsWidth: columnsWidth
          });

          return {
            columns: nextColumns
          };
        });
      };
    };

    _this.autoLoopReplace = function () {
      return setInterval(function () {
        // 如果手动暂停 或者正在请求 则不发送请求
        if (!_this.props.breakReplace && !_this.state.loading) {
          var autoCallback = _this.props.tableCfg.autoCallback;

          _this.reload(_this.props.tableCfg).then(function () {
            autoCallback && autoCallback(_this.getSelection(), _this.getSelectData());
          });
        }
      }, _this.state.replaceTime * 1000);
    };

    _this.beforeLoad = function (tableCfg) {
      var showLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return new Promise(function (resolve) {
        if (showLoading) {
          !_this.props.tableCfg.keepSelection && _this.onSelectChange([], []);

          _this.setState({
            loading: true
          });
        }

        var requestData = {};

        if (tableCfg.hasPaging) {
          var _this$state$paging = _this.state.paging,
              size = _this$state$paging.size,
              current = _this$state$paging.current;
          requestData = _objectSpread(_objectSpread({}, requestData), {}, {
            size: size,
            current: current
          });
        }

        if (tableCfg.searchs) {
          for (var key in tableCfg.searchs) {
            if (tableCfg.searchs[key]) requestData[key] = tableCfg.searchs[key];
          }

          if (tableCfg.handleRequestMethod && typeof tableCfg.handleRequestMethod === 'function') {
            requestData = tableCfg.handleRequestMethod(requestData);
          }
        }

        resolve(requestData);
      });
    };

    _this.loadData = function (tableCfg) {
      var showLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return new Promise(function (resolve) {
        _this.beforeLoad(tableCfg, showLoading).then(function (requestData) {
          tableCfg.apiMethod(requestData).then(function (res) {
            resolve(res);
          }).catch(function (error) {
            _this.setState({
              loading: false
            });

            _message.error(error.message || error);
          });
        });
      });
    };

    _this.afterLoad = function (tableCfg, res) {
      return new Promise(function (resolve) {
        wrapResponse(res).then(function () {
          // 页码超出 显示最大
          if (res.data.current > res.data.pages && res.data.pages) {
            var size = _this.state.paging.size;
            return _this.pageChange(res.data.pages, size);
          }

          _this.setState({
            loading: false,
            data: res.data.data ? res.data.data.records || [] : res.data.records || [],
            paging: _objectSpread(_objectSpread({}, _this.state.paging), {}, {
              total: res.data.data ? res.data.data.total : res.data.total
            })
          });

          _this.props.afterLoad && _this.props.afterLoad();
          resolve(res);
        }).catch(function () {
          _this.setState({
            loading: false,
            data: []
          });
        });
      });
    };

    _this.search = function (tableCfg) {
      return new Promise(function (resolve) {
        _this.setState({
          paging: _objectSpread(_objectSpread({}, _this.state.paging), {}, {
            current: 1
          })
        }, function () {
          return _this.loadData(tableCfg).then(function (res) {
            _this.afterLoad(tableCfg, res).then(function () {
              return resolve(res);
            });
          });
        });
      });
    };

    _this.refresh = function (tableCfg) {
      return new Promise(function (resolve) {
        _this.loadData(tableCfg).then(function (res) {
          _this.afterLoad(tableCfg, res).then(function () {
            return resolve(res);
          });
        });
      });
    };

    _this.reload = function (tableCfg) {
      var reloadTableCfg = _objectSpread(_objectSpread({}, tableCfg), {}, {
        searchs: _objectSpread(_objectSpread({}, tableCfg.searchs), {}, {
          getType: 'reload'
        })
      });

      return new Promise(function (resolve) {
        _this.loadData(reloadTableCfg, false).then(function (res) {
          _this.afterLoad(reloadTableCfg, res).then(function () {
            return resolve(res);
          });
        });
      });
    };

    _this.replace = function (tableCfg) {
      return new Promise(function (resolve) {
        _this.loadData(tableCfg, false).then(function (res) {
          _this.afterLoad(tableCfg, res).then(function () {
            return resolve(res);
          });
        });
      });
    };

    _this.getSelection = function () {
      return _this.state.selection;
    };

    _this.getSelectData = function () {
      var _this$props$tableCfg = _this.props.tableCfg,
          autoReplace = _this$props$tableCfg.autoReplace,
          rowKey = _this$props$tableCfg.rowKey;

      if (autoReplace) {
        var data = _this.getData();

        var selectedRowKeys = _this.getSelection();

        return data.filter(function (item) {
          return selectedRowKeys.includes(item[rowKey]);
        });
      }

      return _this.state.selectData;
    };

    _this.clearSelection = function () {
      _this.setState({
        selection: [],
        selectData: []
      });
    };

    _this.getData = function () {
      return _this.state.data;
    };

    _this.onSelectChange = function (selectKeys, selectData) {
      var onSelectChange = _this.props.onSelectChange;

      _this.setState({
        selection: selectKeys,
        selectData: selectData
      });

      onSelectChange && onSelectChange(selectKeys, selectData);
    };

    _this.showTotal = function () {
      var _this$state$paging2 = _this.state.paging,
          total = _this$state$paging2.total,
          size = _this$state$paging2.size;
      var totalPage = total % size === 0 ? Math.floor(total / size) : Math.floor(total / size) + 1;
      return "\u5171 ".concat(totalPage, " \u9875 / ").concat(total, " \u6761\u8BB0\u5F55");
    };

    _this.pageChange = function (page, size) {
      var _this$state, _this$state$paging3;

      _this.setState({
        paging: {
          total: ((_this$state = _this.state) === null || _this$state === void 0 ? void 0 : (_this$state$paging3 = _this$state.paging) === null || _this$state$paging3 === void 0 ? void 0 : _this$state$paging3.total) || 1,
          current: page,
          size: size
        }
      }, function () {
        return _this.refresh(_this.props.tableCfg);
      });
    };

    _this.sizeChange = function (current, size) {
      var _this$state2, _this$state2$paging;

      _this.setState({
        paging: {
          total: ((_this$state2 = _this.state) === null || _this$state2 === void 0 ? void 0 : (_this$state2$paging = _this$state2.paging) === null || _this$state2$paging === void 0 ? void 0 : _this$state2$paging.total) || 1,
          current: 1,
          size: size
        }
      }, function () {
        return _this.refresh(_this.props.tableCfg);
      });
    };

    _this.setRepalceTime = function (value) {
      _this.setState({
        replaceTime: value
      });

      clearInterval(_this.timer);
      setTimeout(function () {
        _this.timer = _this.autoLoopReplace();
      }, value);
    };

    _this.renderReplaceTime = function () {
      var replaceTimeOptions = _this.props.tableCfg.replaceTimeOptions;
      return replaceTimeOptions.map(function (item) {
        return /*#__PURE__*/React.createElement(Option, {
          key: item,
          value: item
        }, "".concat(item, "s"));
      });
    };

    _this.timer = null;
    var _this$props$tableCfg2 = _this.props.tableCfg,
        paging = _this$props$tableCfg2.paging,
        _columns = _this$props$tableCfg2.columns,
        _this$props$tableCfg3 = _this$props$tableCfg2.selection,
        selection = _this$props$tableCfg3 === void 0 ? [] : _this$props$tableCfg3;
    _this.state = {
      loading: false,
      replaceTime: '5',
      //  如果有刷新 默认5s刷新
      selection: selection,
      selectData: [],
      // 可能会出现不同步到情况
      columns: _columns,
      columnsWidth: {},
      paging: {
        size: paging && paging.size || 10,
        current: 1,
        total: 0 // 默认0

      }
    };
    return _this;
  } // 头部标题拖动


  _createClass(Tablex, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      clearInterval(this.timer);
      var _this$props$tableCfg4 = this.props.tableCfg,
          autoReplace = _this$props$tableCfg4.autoReplace,
          autoFetch = _this$props$tableCfg4.autoFetch;

      if (autoReplace) {
        this.timer = this.autoLoopReplace();
      }

      this.props.onRef && this.props.onRef(this);
      autoFetch && this.refresh(_objectSpread({}, this.props.tableCfg)); // 给columns 添加minwidth 默认最大宽度500

      var columns = this.state.columns;
      var addMinCol = columns.map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          minWidth: item.width ? item.minWidth || item.width : undefined,
          maxWidth: item.maxWidth || 500
        });
      });
      this.setState({
        columns: addMinCol
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.timer);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (JSON.stringify(this.props.tableCfg) !== JSON.stringify(prevProps.tableCfg)) {
        var columnsWidth = this.state.columnsWidth;
        var _this$props$tableCfg5 = this.props.tableCfg,
            selection = _this$props$tableCfg5.selection,
            columns = _this$props$tableCfg5.columns;
        var styleColumns = columns.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            width: columnsWidth[item.dataIndex] || item.width
          });
        });
        this.setState({
          selection: selection,
          columns: styleColumns
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this,
          _this$state4;

      var _this$state3 = this.state,
          loading = _this$state3.loading,
          data = _this$state3.data,
          selection = _this$state3.selection,
          paging = _this$state3.paging,
          columns = _this$state3.columns,
          isResize = _this$state3.isResize;
      var _this$props$tableCfg6 = this.props.tableCfg,
          rowKey = _this$props$tableCfg6.rowKey,
          expandedRowRender = _this$props$tableCfg6.expandedRowRender,
          pageSizeOptions = _this$props$tableCfg6.pageSizeOptions,
          hasRowSelection = _this$props$tableCfg6.hasRowSelection,
          scroll = _this$props$tableCfg6.scroll,
          locale = _this$props$tableCfg6.locale,
          autoReplace = _this$props$tableCfg6.autoReplace;
      var total = paging.total,
          size = paging.size,
          current = paging.current;
      var rowSelection = {
        selectedRowKeys: selection,
        onChange: this.onSelectChange,
        getCheckboxProps: function getCheckboxProps() {
          return {
            disabled: _this2.props.disabled
          };
        }
      };
      var onChange = this.props.onChange;
      var columnsResize = columns.map(function (col, index) {
        // 如果columns里面有resize 则表格可以resize
        if (!_this2.state.isResize && col.resize) {
          _this2.setState({
            isResize: true
          });
        }

        return _objectSpread(_objectSpread({}, col), {}, {
          minWidth: col.width,
          onHeaderCell: !col.resize ? undefined : function (column) {
            return {
              width: column.width,
              onResize: _this2.handleResize(index)
            };
          }
        });
      });
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Table, {
        className: this.props.className,
        rowSelection: hasRowSelection ? rowSelection : null,
        columns: isResize ? columnsResize : columns,
        components: isResize ? this.components : undefined,
        dataSource: data,
        rowKey: rowKey,
        loading: loading,
        pagination: false,
        scroll: scroll,
        locale: locale,
        expandedRowRender: expandedRowRender,
        onRow: this.props.onRow,
        onChange: onChange
      }), !!total && /*#__PURE__*/React.createElement("div", {
        className: "pagination-wrapper"
      }, /*#__PURE__*/React.createElement(_Button, {
        className: "replace-button",
        icon: "sync",
        onClick: function onClick() {
          return _this2.refresh(_this2.props.tableCfg);
        }
      }), autoReplace && /*#__PURE__*/React.createElement(_Select, {
        size: "small",
        className: "replace-select",
        value: (_this$state4 = this.state) === null || _this$state4 === void 0 ? void 0 : _this$state4.replaceTime,
        onChange: this.setRepalceTime
      }, this.renderReplaceTime()), /*#__PURE__*/React.createElement(_Pagination, {
        size: "small",
        total: total || 1 // 最小显示1
        ,
        pageSize: size,
        current: current,
        onChange: this.pageChange,
        onShowSizeChange: this.sizeChange,
        showTotal: this.showTotal,
        pageSizeOptions: pageSizeOptions,
        showSizeChanger: true
      })));
    }
  }]);

  return Tablex;
}(React.Component);

Tablex.createTableCfg = createTableCfg;
Tablex.TableWrap = TableWrap;
Tablex.ToolBar = ToolBar;
Tablex.BarLeft = BarLeft;
Tablex.BarRight = BarRight; // export { TableWrap, ToolBar, BarLeft, BarRight }

export default Tablex;