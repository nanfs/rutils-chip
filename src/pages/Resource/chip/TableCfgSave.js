import React from 'react'
import resourceApi from '@/services/resource'
import { Progress } from 'antd'
import { storageStatusRender, storageTypeRender } from '@/utils/tableRender'

export const columnsSave = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    filters: [
      {
        text: '激活',
        value: [3]
      },
      {
        text: '未激活',
        value: [4]
      },
      {
        text: '维护',
        value: [6]
      },
      {
        text: '未附加',
        value: [2]
      },
      {
        text: '其他',
        value: [0, 1, 5, 7, 8, 9]
      }
    ],
    render: text => storageStatusRender(text)
  },
  {
    title: '存储域名称',
    dataIndex: 'name'
  },
  {
    title: '数据中心',
    dataIndex: 'storagePoolName'
  },
  {
    title: '类型',
    dataIndex: 'storageType',
    render: text => storageTypeRender(text)
  },
  {
    title: '使用情况',
    dataIndex: 'usage',
    width: '20%',
    render: (text, record) => {
      return (
        <Progress
          strokeWidth={16}
          percent={
            (parseFloat(record.usedDiskSize) /
              parseFloat(record.availableDiskSize)) *
            100
          }
          format={() => {
            if (!record.usedDiskSize || !record.availableDiskSize) {
              return 'N/A'
            } else {
              return `${record.usedDiskSize}G/${record.availableDiskSize}G`
            }
          }}
          status={
            record.usedDiskSize !== record.availableDiskSize
              ? 'active'
              : 'exception'
          }
        ></Progress>
      )
    }
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
]
export const apiMethodSave = resourceApi.listSave
