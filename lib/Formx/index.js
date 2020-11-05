import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.reflect.construct";
import "antd/lib/form/style";
import _Form from "antd/lib/form";
import _extends from "@babel/runtime/helpers/extends";
import "antd/lib/message/style";
import _message from "antd/lib/message";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
var formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 5,
      pull: 1
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 8
    }
  }
};

var Formx = /*#__PURE__*/function (_React$Component) {
  _inherits(Formx, _React$Component);

  var _super = _createSuper(Formx);

  function Formx() {
    var _this;

    _classCallCheck(this, Formx);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this.handleSubmit = function (e) {
      e.preventDefault();
      var _this$props = _this.props,
          onSubmit = _this$props.onSubmit,
          form = _this$props.form;
      form.validateFieldsAndScroll(function (error, values) {
        if (!error) {
          onSubmit && onSubmit(values);
        }
      }).catch(function (error) {
        _message.error(error.message || error);

        console.log(error);
      });
    };

    _this.renderFormItem = function (child, submitting, isParentShow) {
      var _child$props3;

      if (! /*#__PURE__*/React.isValidElement(child)) {
        return child;
      }

      if (child.props.prop) {
        var _child$props;

        var _this$props$form = _this.props.form,
            getFieldDecorator = _this$props$form.getFieldDecorator,
            getFieldValue = _this$props$form.getFieldValue,
            getFieldsValue = _this$props$form.getFieldsValue;
        var rules = child.props.rules || undefined;
        var validateTrigger = child.props.validateTrigger || 'onChange';
        var value = getFieldValue(child.props.prop);
        var values = getFieldsValue();
        var childNode = getFieldDecorator(child.props.prop, {
          rules: rules,
          validateTrigger: validateTrigger,
          valuePropName: child.props.valuepropname ? 'checked' : 'value'
        }, {})( /*#__PURE__*/React.cloneElement(child.props.children, {
          disabled: child.props.children.props.disabled || submitting,
          onChange: function onChange(e) {
            var onChange = child.props.children.props.onChange;
            onChange && onChange(value, values, e);
          }
        }));
        return /*#__PURE__*/React.cloneElement(child, {
          disabled: true || ((_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.disabled) || submitting
        }, childNode);
      }

      if (child.props.children) {
        var _child$props2;

        var sonNode = React.Children.map(child.props.children, function (son) {
          return _this.renderFormItem(son, submitting, isParentShow);
        });
        return /*#__PURE__*/React.cloneElement(child, {
          disabled: ((_child$props2 = child.props) === null || _child$props2 === void 0 ? void 0 : _child$props2.disabled) || submitting
        }, sonNode);
      } // 刷新除了 TODO
      // if (child.props && child.props.onRef) {
      //   return child
      // }


      return isParentShow !== false && /*#__PURE__*/React.cloneElement(child, {
        disabled: ((_child$props3 = child.props) === null || _child$props3 === void 0 ? void 0 : _child$props3.disabled) || submitting
      });
    };

    return _this;
  }

  _createClass(Formx, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var onRef = this.props.onRef;
      onRef && onRef(this);
      this.props.form.setFieldsValue(this.props.initValues);
      this.forceUpdate();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prep) {
      if (JSON.stringify(this.props.initValues) !== JSON.stringify(prep.initValues) && this.props.form) {
        this.props.form.setFieldsValue(this.props.initValues);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          children = _this$props2.children,
          className = _this$props2.className,
          style = _this$props2.style,
          submitting = _this$props2.submitting,
          isParentShow = _this$props2.isParentShow;
      var formLayout = this.props.formItemLayout || formItemLayout;
      return /*#__PURE__*/React.createElement(_Form, _extends({}, formLayout, {
        onSubmit: this.handleSubmit,
        className: className,
        style: style
      }), React.Children.map(children, function (child) {
        return _this2.renderFormItem(child, submitting, isParentShow);
      }));
    }
  }]);

  return Formx;
}(React.Component);

export default _Form.create()(Formx);