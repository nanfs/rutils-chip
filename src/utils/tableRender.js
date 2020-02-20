import React from 'react'
import { Icon } from 'antd'

export const severityOptions = [
  {
    text: '一般',
    value: 0,
    icon: 'info-circle',
    color: 'info'
  },
  {
    text: '警告',
    value: 1,
    icon: 'warning',
    color: 'warn'
  },
  {
    text: '错误',
    value: 2,
    icon: 'alert',
    color: 'alert'
  },
  {
    text: '告警',
    value: 10,
    icon: 'bulb',
    color: 'msg'
  }
]
export function renderServerityOptions(recordText) {
  const current = severityOptions.find(item => item.value === recordText) || {}
  const { text, icon, color } = current
  return <Icon type={icon} className={`table-icon-${color}`} title={text} />
}
