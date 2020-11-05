import "antd/lib/col/style";
import _Col from "antd/lib/col";
import "antd/lib/row/style";
import _Row from "antd/lib/row";
import React from 'react';
export default function TableWrap(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, props.children);
}
export function ToolBar(props) {
  return /*#__PURE__*/React.createElement(_Row, {
    className: "table-tool"
  }, props.children);
}
export function BarLeft(props) {
  return /*#__PURE__*/React.createElement(_Col, {
    className: "bar-left",
    span: props.span || 12
  }, props.children);
}
export function BarRight(props) {
  return /*#__PURE__*/React.createElement(_Col, {
    className: "bar-right",
    span: props.span || 12
  }, props.children);
}