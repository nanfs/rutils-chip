import React from 'react'
import { Row, Col } from 'antd'

export default function TableWrap(props) {
  return <div className="table-wrap">{props.children}</div>
}
export function ToolBar(props) {
  return <Row className="table-tool">{props.children}</Row>
}
export function BarLeft(props) {
  return (
    <Col className="bar-left" span={props.span || 12}>
      {props.children}
    </Col>
  )
}
export function BarRight(props) {
  return (
    <Col className="bar-right" span={props.span || 12}>
      {props.children}
    </Col>
  )
}
