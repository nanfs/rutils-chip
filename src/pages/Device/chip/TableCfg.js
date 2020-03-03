import React from 'react'
import deviceApi from '@/services/device'
import { Icon, Popover, Tag } from 'antd'
import { MyIcon } from '@/components'

export const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '已绑定终端数',
    dataIndex: 'boundTcNum',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: 'USB外设',
    width: 120,
    dataIndex: 'usagePeripherals',
    render: text => {
      if (text === '1') {
        return (
          <span>
            <Icon type="check-circle" style={{ color: '#19c0f0' }} /> 开启所有
          </span>
        )
      } else {
        return (
          <span>
            <Icon type="stop" style={{ color: '#ee1c3a' }} /> 禁止所有
          </span>
        )
      }
    }
  },
  {
    title: '名单',
    dataIndex: 'usb',
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
