import React from 'react'
import { Breadcrumb } from 'antd'
import dict from './dict.json'

export default function location(props) {
  const { path } = props
  const renderiItem = path.split('/').map((item, index) => {
    if (index === 0) {
      return <Breadcrumb.Item key={item}>服务器升级</Breadcrumb.Item>
    }
    if (index === path.split('/').length - 1) {
      return <Breadcrumb.Item key={item}>{dict[item]}</Breadcrumb.Item>
    }
    return <Breadcrumb.Item key={item}> {dict[item]}</Breadcrumb.Item>
  })
  return <Breadcrumb>{renderiItem}</Breadcrumb>
}
