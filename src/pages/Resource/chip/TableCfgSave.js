import React from 'react'
import resourceApi from '@/services/resource'
import { Icon } from 'antd'
import styles from '../index.m.scss'

export const columnsSave = [
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '存储域名称',
    dataIndex: 'name',
    render: text => {
      return <div className={styles.vmBg}>{text}</div>
    }
  },
  {
    title: '类型',
    dataIndex: 'type'
  },
  {
    title: '使用情况',
    dataIndex: 'used',
    render: (text, record) => {
      return `${record.datacenterName}/${record.clusterName}`
    }
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
]
export const apiMethodSave = resourceApi.listSave
