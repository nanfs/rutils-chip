import React from 'react'
import resourceApi from '@/services/resource'
import { Icon, Progress } from 'antd'
import styles from '../index.m.scss'

export const columnsSave = [
  {
    title: '状态',
    dataIndex: 'status',
    filters: [
      {
        text: '1',
        value: '1'
      },
      {
        text: '3',
        value: '3'
      }
    ],
    onFilter: (value, record) => record.status == value,
    render: text => {
      return <div className={styles.vmBg}>{text}</div>
    }
  },
  {
    title: '存储域名称',
    dataIndex: 'name'
  },
  {
    title: '类型',
    dataIndex: 'type'
  },
  {
    title: '使用情况',
    dataIndex: 'usage',
    width: '20%',
    render: (text, record) => {
      return (
        <Progress
          strokeWidth={16}
          percent={record.used / record.total}
          format={() => `${record.used}G/${record.total}G`}
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
