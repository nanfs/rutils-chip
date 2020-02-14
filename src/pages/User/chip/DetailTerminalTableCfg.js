import React from 'react'
import userApi from '@/services/terminal'
import { Icon } from 'antd'
// TODO antd 样式加载问题
export const detailTeminalColumns = [
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '终端名称',
    dataIndex: 'name'
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '接入状态',
    dataIndex: 'accessStatus'
  },
  {
    title: '上线时间',
    dataIndex: 'time'
  }
]
export const detailTeminalApiMethod = userApi.list
