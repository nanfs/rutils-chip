import React from 'react'
import resourceApi from '@/services/resource'
import { Progress } from 'antd'
import MyIcon from '@/components/MyIcon'

const statusRender = status => {
  const typeList = {
    '0': 'poweroff',
    '1': 'downing',
    '2': 'uping',
    '3': 'zaixian',
    '4': 'success',
    '5': 'link',
    '6': 'unlink',
    '7': 'turn-off',
    '8': 'poweroff',
    '9': 'downing'
  }
  return (
    <MyIcon
      type={typeList[status]}
      component="svg"
      style={{ fontSize: '18px' }}
    />
  )
}

export const columnsSave = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    filters: [
      {
        text: '未知',
        value: '0'
      },
      {
        text: '未初始化',
        value: '1'
      },
      {
        text: '未连接',
        value: '2'
      },
      {
        text: '激活',
        value: '3'
      },
      {
        text: '正在激活',
        value: '4'
      },
      {
        text: '锁定',
        value: '5'
      },
      {
        text: '维护',
        value: '6'
      },
      {
        text: '准备维护',
        value: '7'
      },
      {
        text: '分离过程中',
        value: '8'
      },
      {
        text: '激活过程中',
        value: '9'
      }
    ],
    onFilter: (value, record) => record.status == value,
    render: text => statusRender(text)
  },
  {
    title: '存储域名称',
    dataIndex: 'storageName'
  },
  {
    title: '类型',
    dataIndex: 'storageType'
  },
  {
    title: '使用情况',
    dataIndex: 'usage',
    width: '20%',
    render: (text, record) => {
      return (
        <Progress
          strokeWidth={16}
          percent={record.usedDiskSize / record.availableDiskSize}
          format={() => `${record.usedDiskSize}G/${record.availableDiskSize}G`}
        ></Progress>
      )
    }
  },
  {
    title: '描述',
    dataIndex: 'storageDescription'
  }
]
export const apiMethodSave = resourceApi.listSave
