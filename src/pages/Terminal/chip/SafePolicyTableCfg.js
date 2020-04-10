import React from 'react'
import deviceApi from '@/services/device'
import { Icon, Popover, Tag } from 'antd'
import { MyIcon } from '@/components'

export const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '描述',
    dataIndex: 'description',
    ellipsis: true
  },
  {
    title: '已绑定终端数',
    dataIndex: 'boundTcNum',
    width: 150,
    render: text => <Tag color="blue">{text}</Tag>
  },
  {
    title: 'USB外设',
    width: 150,
    dataIndex: 'usagePeripherals',
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
    title: '名单',
    dataIndex: 'usb',
    width: 150,
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
  }
]
export const apiMethod = deviceApi.list
