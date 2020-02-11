import React from 'react'
import terminalApi from '@/services/terminal'
import { Icon, Popover } from 'antd'
// TODO antd 样式加载问题
export const detailUseTimeColumns = [
  {
    title: '上线时间',
    dataIndex: 'onlinetime'
  },
  {
    title: '下线时间',
    dataIndex: 'offlinetime'
  }
]
export const detailUseTimeApiMethod = terminalApi.list
