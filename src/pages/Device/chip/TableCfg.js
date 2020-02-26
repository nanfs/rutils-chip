import React from 'react'
import deviceApi from '@/services/device'
import { Icon, Popover } from 'antd'
import MyIcon from '@/components/MyIcon'

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
    dataIndex: 'boundTcNum'
  },
  {
    title: '外设',
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
    title: '特例',
    dataIndex: 'usb',
    render: (text, record) => {
      const info = record.usbs.map((item, index) => (
        // <Row key={index}>
        //   <Col span={8}>name：{item.name}，</Col>
        //   <Col span={8}>vid：{item.vid}，</Col>
        //   <Col span={8}>pid:{item.pid}</Col>
        // </Row>
        <p key={index}>
          name：{item.name}，vid：{item.vid}，pid:{item.pid}
        </p>
      ))
      return (
        <Popover content={info}>
          <MyIcon
            type="order-info"
            component="svg"
            style={{ cursor: 'pointer' }}
          />
        </Popover>
      )
    }
  }
]
export const apiMethod = deviceApi.list
