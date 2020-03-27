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
    title: '名单',
    dataIndex: 'usb',
    render: (text, record) => {
      const info =
        record.usbs &&
        record.usbs.map((item, index) => (
          <p key={index}>
            name：{item.name}，vid：{item.vid}，pid:{item.pid}
          </p>
        ))
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
