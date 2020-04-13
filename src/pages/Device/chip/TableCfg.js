import React from 'react'
import deviceApi from '@/services/device'
import { Icon, Popover, Tag } from 'antd'
import { MyIcon } from '@/components'

export const columns = [
  {
    title: () => <span title="已绑定终端数">已绑定终端数</span>,
    dataIndex: 'boundTcNum',
    width: 150,
    className: 'ellipsis-hasTag',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: () => <span title="USB外设">USB外设</span>,
    dataIndex: 'usagePeripherals',
    width: 150,
    render: text => {
      if (text === '1') {
        return (
          <span>
            <Icon type="check-circle" style={{ color: '#19c0f0' }} /> 启用白名单
          </span>
        )
      } else {
        return (
          <span>
            <Icon type="stop" style={{ color: '#ee1c3a' }} /> 启用黑名单
          </span>
        )
      }
    }
  },
  {
    title: () => <span title="名单">名单</span>,
    dataIndex: 'usb',
    width: 120,
    render: (text, record) => {
      const info = record.usbs.map((item, index) => (
        <p key={index}>
          name：{item.name}，vid：{item.vid}，pid:{item.pid}
        </p>
      ))
      return info.length ? (
        <Popover content={info}>
          <MyIcon
            type="order-info"
            component="svg"
            style={{ cursor: 'pointer' }}
          />
        </Popover>
      ) : (
        <span>无</span>
      )
    }
  },
  {
    title: () => <span title="描述">描述</span>,
    dataIndex: 'description',
    ellipsis: true
  }
]
export const apiMethod = deviceApi.list
