import React from 'react'
import { Popover } from 'antd'
import userApi from '@/services/user'
import { vmStatusRender } from '@/utils/tableRender'
import { MyIcon } from '@/components'
import { onlineStringTime } from '@/utils/tool'

export const detailDesktopColumns = [
  {
    title: '桌面名称',
    dataIndex: 'vmname',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 180,
    /* filters: [
      { value: [0, 13], text: '已关机' },
      { value: [1], text: '正在运行' },
      { value: [2, 16, 10, 15, 5, 6, 11, 12, 9], text: '运行' },
      { value: [7, 8, 14, -1, 4], text: '异常' }
    ], */
    render: text => vmStatusRender(text)
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    ellipsis: true
  },
  {
    title: '控制台',
    dataIndex: 'consolestatus',
    width: 180,
    render: (text, record) => {
      const consoleContent = record.clientIp ? (
        <Popover content={record.clientIp}>
          <MyIcon type="tc-connecting" component="svg" />
          <span title="已连接">已连接</span>
        </Popover>
      ) : (
        <div className="ellipsis-noWhiteSpace">
          <MyIcon type="storage-unattached" component="svg" />
          <span title="未连接">未连接</span>
        </div>
      )
      return consoleContent
    }
  },
  {
    title: '已运行',
    key: 'onlineTime',
    dataIndex: 'onlineTime',
    render: text => onlineStringTime(text)
  }
]
export const detailDesktopApiMethod = userApi.desktopList
