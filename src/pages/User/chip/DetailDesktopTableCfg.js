import React from 'react'
import userApi from '@/services/user'
import { Progress } from 'antd'
import { vmStatusRender, osStatusRender } from '@/utils/tableRender'
import MyIcon from '@/components/MyIcon'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    filters: [
      { value: [0, 13], text: '关机' },
      { value: [1], text: '开机' },
      { value: [2, 16, 10, 15, 5, 6, 11, 12, 9], text: '运行' },
      { value: [7, 8, 14, -1, 4], text: '异常' }
    ],
    render: text => vmStatusRender(text)
  },
  {
    title: '基本信息',
    dataIndex: 'name',
    render: (text, record) => {
      return (
        <span>
          {osStatusRender(record.os)}
          {record.name}
        </span>
      )
    }
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '控制台',
    dataIndex: 'isConsole',
    width: 100,
    render: (text, record) => {
      const consoleContent = record.consoleUserName ? (
        <div>
          <MyIcon type="tc-connecting" component="svg" />
          <span>已连接</span>{' '}
        </div>
      ) : (
        <div>
          <MyIcon type="storage-unattached" component="svg" />
          <span>未连接</span>
        </div>
      )
      return consoleContent
    }
  },
  {
    title: '本次运行时长',
    key: 'onlineTime',
    dataIndex: 'onlineTime'
  }
]
export const detailDesktopApiMethod = userApi.desktopList
