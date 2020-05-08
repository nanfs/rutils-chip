import React from 'react'
import taskApi from '@/services/task'
import { Icon, Tag } from 'antd'

const iconStyle = {
  check: { color: '#17abe3' },
  close: { color: '#ff4d4f' }
}
const weekCh = {
  MON: '周一',
  TUE: '周二',
  WED: '周三',
  THU: '周四',
  FRI: '周五',
  SAT: '周六',
  SUN: '周日'
}
export const columns = [
  {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'createTime',
    ellipsis: true
  },
  {
    title: () => <span title="描述">描述</span>,
    dataIndex: 'updateTime',
    ellipsis: true
  }
]
export const apiMethod = taskApi.list
