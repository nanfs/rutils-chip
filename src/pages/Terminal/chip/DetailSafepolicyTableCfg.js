import React from 'react'
import { Icon, Popover, Tag } from 'antd'
import { MyIcon } from '@/components'

// eslint-disable-next-line import/prefer-default-export
export const detailSafepolicyColumns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: 'USB外设',
    width: 150,
    dataIndex: 'usbSupport',
    render: text => {
      if (text === '1') {
        return (
          <span>
            <Icon type="check-circle" style={{ color: '#19c0f0' }} /> 开启
          </span>
        )
      } else {
        return (
          <span>
            <Icon type="stop" style={{ color: '#ee1c3a' }} /> 禁止
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
      console.log(record)
      const info = record.usbExcept
        ? JSON.parse(record.usbExcept).map((item, index) => (
            <p key={index}>
              name：{item.name}，vid：{item.vid}，pid:{item.pid}
            </p>
          ))
        : ''
      return info?.length ? (
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
