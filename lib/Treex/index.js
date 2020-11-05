import "core-js/modules/es7.object.get-own-property-descriptors";
import "core-js/modules/es6.symbol";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/spin/style";
import _Spin from "antd/lib/spin";
import "antd/lib/menu/style";
import _Menu from "antd/lib/menu";
import "antd/lib/icon/style";
import _Icon from "antd/lib/icon";
import "antd/lib/notification/style";
import _notification from "antd/lib/notification";
import "antd/lib/message/style";
import _message from "antd/lib/message";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.keys";
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.string.includes";
import "core-js/modules/es6.array.sort";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "antd/lib/input/style";
import _Input from "antd/lib/input";
import "antd/lib/tree/style";
import _Tree from "antd/lib/tree";
import "antd/lib/modal/style";
import _Modal from "antd/lib/modal";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { nodes2Tree, wrapResponse } from '../utils/tool';
import AddNodeModal from './chip/AddNodeModal';
import EditNodeModal from './chip/EditNodeModal';
import MyIcon from '../MyIcon';
import './index.less';
var confirm = _Modal.confirm;
var TreeNode = _Tree.TreeNode;
var Search = _Input.Search; // 获取节点的父节点key

var getParentKey = function getParentKey(key, tree) {
  var parentKey;

  for (var i = 0; i < tree.length; i++) {
    var node = tree[i];

    if (node.children) {
      if (node.children.some(function (item) {
        return item.key === key;
      })) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }

  return parentKey;
}; // 获取每个节点 用于查找


var generateList = function generateList(data) {
  var allKey = [];
  var nodeList = [];

  for (var i = 0; i < data.length; i++) {
    var node = data[i];
    var key = node.key,
        title = node.title;
    allKey.push(key.toString());
    nodeList.push({
      key: key,
      title: title
    });

    if (node.children) {
      generateList(node.children);
    }
  }

  return {
    allKey: allKey,
    nodeList: nodeList
  };
};

var Treex = /*#__PURE__*/function (_React$Component) {
  _inherits(Treex, _React$Component);

  var _super = _createSuper(Treex);

  function Treex() {
    var _this;

    _classCallCheck(this, Treex);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      value: '',
      searchValue: '',
      autoExpandParent: true,
      expandedKeys: [],
      selectedKeys: [],
      nodeList: [],
      nodes: undefined,
      loadding: true,
      rightClickNodeTreeItem: {
        pageX: '',
        pageY: '',
        id: '',
        categoryName: ''
      },
      rightMenuStyle: {
        display: 'none'
      },
      nodeDeleteDisable: false
    };

    _this.getTreeData = function () {
      var _this$props = _this.props,
          apiMethod = _this$props.apiMethod,
          treeRenderSuccess = _this$props.treeRenderSuccess,
          _this$props$defaultSe = _this$props.defaultSelectRootNode,
          defaultSelectRootNode = _this$props$defaultSe === void 0 ? true : _this$props$defaultSe,
          treeData = _this$props.treeData;

      if (!apiMethod) {
        _this.setState({
          nodes: treeData,
          loading: false
        });

        return false;
      }

      apiMethod().then(function (res) {
        if (res.success) {
          var nodes = res.data.map(function (element) {
            return _objectSpread(_objectSpread({}, element), {}, {
              key: element.key.toString(),
              id: element.id.toString(),
              value: element.id.toString(),
              parentId: element.parentId === null ? '-1' : element.parentId.toString()
            });
          });
          nodes.sort(function (a, b) {
            return a.parentId - b.parentId;
          });

          if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes('key')) {
            throw new Error('数据格式不符合');
          }

          var _generateList = generateList(nodes),
              allKey = _generateList.allKey,
              nodeList = _generateList.nodeList;

          _this.setState({
            expandedKeys: allKey,
            selectedKeys: defaultSelectRootNode && [nodes[0].key],
            // 是否默认选中根节点
            nodeList: nodeList,
            nodes: nodes,
            loading: false
          });

          defaultSelectRootNode && treeRenderSuccess && treeRenderSuccess(nodes[0].key, nodes);
        } else {
          _this.nodes = [];

          _this.setState({
            loading: false
          });
        }
      }).catch(function (error) {
        _this.setState({
          loading: false
        });

        _message.error(error.message || error);

        console.log(error);
      });
    };

    _this._handleClick = function () {
      _this.setState({
        rightMenuStyle: {
          display: 'none'
        }
      });
    };

    _this.onExpand = function (expandedKeys) {
      _this.setState({
        expandedKeys: expandedKeys,
        autoExpandParent: false
      });
    };

    _this.onChange = function (e) {
      var value = e.target.value;
      var _this$state = _this.state,
          nodes = _this$state.nodes,
          nodeList = _this$state.nodeList;
      var data = nodes2Tree(nodes);
      var expandedKeys = nodeList.map(function (item) {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, data);
        }

        return null;
      }).filter(function (item, i, self) {
        return item && self.indexbuOf(item) === i;
      });

      _this.setState({
        expandedKeys: expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    };

    _this.onSelect = function (key, node) {
      var onSelect = _this.props.onSelect;
      onSelect && onSelect(node.node.props.eventKey, node);

      _this.setState({
        selectedKeys: [node.node.props.eventKey]
      });
    };

    _this.renderTreeNode = function (data) {
      var searchValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return data.map(function (item) {
        var index = item.title.indexOf(searchValue);
        var iconType = '';

        if (item.title === '本地组(internal)') {
          iconType = 'yonghuguanli1';
        } else if (item.parentId === '-2') {
          iconType = 'adyu';
        }

        var beforeStr = item.title.substr(0, index);
        var afterStr = item.title.substr(index + searchValue.length);
        var title = index > -1 ? /*#__PURE__*/React.createElement("span", {
          title: item.title
        }, beforeStr, /*#__PURE__*/React.createElement("span", {
          style: {
            color: '#f50'
          }
        }, searchValue), afterStr) : /*#__PURE__*/React.createElement("span", {
          title: item.title
        }, item.title);

        if (item.children) {
          return /*#__PURE__*/React.createElement(TreeNode, {
            key: item.id,
            title: title,
            "data-key": item.id,
            "data-title": item.title,
            parentId: item.parentId,
            type: item.type,
            icon: function icon() {
              return iconType ? /*#__PURE__*/React.createElement(MyIcon, {
                type: iconType,
                component: "svg",
                style: {
                  fontSize: iconType === 'adyu' ? '22px' : '18px',
                  color: '#1890ff'
                }
              }) : '';
            }
          }, _this.renderTreeNode(item.children, searchValue));
        }

        return /*#__PURE__*/React.createElement(TreeNode, {
          key: item.id,
          title: title,
          "data-key": item.id,
          "data-title": item.title,
          parentId: item.parentId,
          type: item.type,
          icon: function icon() {
            return iconType ? /*#__PURE__*/React.createElement(MyIcon, {
              type: iconType,
              component: "svg",
              style: {
                fontSize: iconType === 'adyu' ? '22px' : '20px',
                color: '#1890ff'
              }
            }) : '';
          }
        });
      });
    };

    _this.onRightClick = function (e) {
      var nodeDeleteDisable = e.node.props.parentId === '-1';
      e.event.stopPropagation();

      _this.setState({
        rightClickNodeTreeItem: {
          pageX: e.event.pageX,
          pageY: e.event.pageY,
          id: e.node.props['data-key'],
          name: e.node.props['data-title'],
          parentId: e.node.props.parentId
        },
        rightMenuStyle: {
          position: 'absolute',
          left: "".concat(e.event.pageX - parseInt(document.querySelector('.ant-layout-sider').style.width, 10) - 50, "px"),
          top: "".concat(e.event.pageY - 115, "px"),
          display: 'block',
          zIndex: 1001
        },
        nodeDeleteDisable: nodeDeleteDisable
      });
    };

    _this.deleteNode = function () {
      var deleteNodeApiMethod = _this.props.deleteNodeApiMethod;

      var self = _assertThisInitialized(_this);

      confirm({
        title: '确认删除该节点吗？',
        onOk: function onOk() {
          deleteNodeApiMethod({
            id: parseInt(self.state.rightClickNodeTreeItem.id, 10)
          }).then(function (res) {
            wrapResponse(res).then(function () {
              _notification.success({
                message: '删除成功'
              });

              self.getTreeData();
            }).catch(function (error) {
              _message.error(error.message || '删除失败');
            });
          });
        },
        onCancel: function onCancel() {}
      });
    };

    _this.cleanSelected = function () {
      _this.setState({
        selectedKeys: []
      });
    };

    return _this;
  }

  _createClass(Treex, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onRef && this.props.onRef(this); // document.addEventListener('contextmenu', this._handleContextMenu)

      document.addEventListener('click', this._handleClick);
      this.getTreeData();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // document.removeEventListener('contextmenu', this._handleContextMenu)
      document.removeEventListener('click', this._handleClick);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prep) {
      if (this.props.treeData !== prep.value && prep.treeData === undefined) {
        this.setState({
          nodes: this.props.treeData
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          _this$props2$showSear = _this$props2.showSearch,
          showSearch = _this$props2$showSear === void 0 ? true : _this$props2$showSear,
          _this$props2$showRigh = _this$props2.showRightClinkMenu,
          showRightClinkMenu = _this$props2$showRigh === void 0 ? false : _this$props2$showRigh,
          addNodeApiMethod = _this$props2.addNodeApiMethod,
          editNodeApiMethod = _this$props2.editNodeApiMethod,
          _this$props2$checkabl = _this$props2.checkable,
          checkable = _this$props2$checkabl === void 0 ? false : _this$props2$checkabl;
      var _this$state2 = this.state,
          rightClickNodeTreeItem = _this$state2.rightClickNodeTreeItem,
          rightMenuStyle = _this$state2.rightMenuStyle; // console.log(rightClickNodeTreeItem)
      // const { pageX, pageY, id, categoryName } = rightClickNodeTreeItem

      var _this$state3 = this.state,
          searchValue = _this$state3.searchValue,
          expandedKeys = _this$state3.expandedKeys,
          selectedKeys = _this$state3.selectedKeys,
          autoExpandParent = _this$state3.autoExpandParent,
          nodes = _this$state3.nodes,
          loading = _this$state3.loading;
      return /*#__PURE__*/React.createElement(_Spin, {
        spinning: loading
      }, showSearch && /*#__PURE__*/React.createElement(Search, {
        onChange: this.onChange,
        className: "tree-search"
      }), /*#__PURE__*/React.createElement(_Tree, {
        showIcon: true,
        defaultExpandAll: true,
        selectedKeys: selectedKeys,
        className: "tree-wrap",
        onExpand: this.onExpand,
        onSelect: this.onSelect,
        expandedKeys: expandedKeys,
        autoExpandParent: autoExpandParent,
        checkable: checkable,
        multiple: true,
        onRightClick: showRightClinkMenu && this.onRightClick
      }, this.renderTreeNode(nodes2Tree(nodes), searchValue)), rightClickNodeTreeItem && /*#__PURE__*/React.createElement("div", {
        style: _objectSpread({}, rightMenuStyle),
        className: "self-right-menu"
      }, /*#__PURE__*/React.createElement(_Menu, null, /*#__PURE__*/React.createElement(_Menu.Item, {
        key: "addNode",
        onClick: function onClick() {
          _this2.addNodeModal.pop();
        }
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "plus",
        style: {
          color: '#1890ff'
        }
      }), "\u65B0\u589E\u4E0B\u7EA7\u90E8\u95E8"), /*#__PURE__*/React.createElement(_Menu.Item, {
        key: "editNode",
        onClick: function onClick() {
          _this2.editNodeModal.pop();
        },
        disabled: this.state.nodeDeleteDisable
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "edit",
        style: {
          color: this.state.nodeDeleteDisable ? 'rgba(0,0,0,.25)' : '#1890ff'
        }
      }), "\u4FEE\u6539"), /*#__PURE__*/React.createElement(_Menu.Item, {
        key: "deleteNode",
        onClick: this.deleteNode,
        disabled: this.state.nodeDeleteDisable
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "delete",
        style: {
          color: this.state.nodeDeleteDisable ? 'rgba(0,0,0,.25)' : '#ee1c3a'
        }
      }), "\u5220\u9664"))), /*#__PURE__*/React.createElement(AddNodeModal, {
        onRef: function onRef(ref) {
          _this2.addNodeModal = ref;
        },
        addNodeApiMethod: addNodeApiMethod,
        nodeValues: rightClickNodeTreeItem,
        addNodeSuccess: this.getTreeData
      }), /*#__PURE__*/React.createElement(EditNodeModal, {
        onRef: function onRef(ref) {
          _this2.editNodeModal = ref;
        },
        editNodeApiMethod: editNodeApiMethod,
        nodeValues: rightClickNodeTreeItem,
        editNodeSuccess: this.getTreeData
      }));
    }
  }]);

  return Treex;
}(React.Component);

export { Treex as default };