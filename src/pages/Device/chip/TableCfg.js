import React from 'react'
import deviceApi from '@/services/device'
import { Icon } from 'antd'

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
    title: '已绑定数量',
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
    dataIndex: 'usbSupport'
  }
]
export const apiMethod = deviceApi.list
