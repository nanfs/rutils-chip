import React from 'react'
import resourceApi from '@/services/resource'
import { Icon } from 'antd'
import styles from '../index.m.scss'

export const columnsCompute = [
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '主机名称',
    dataIndex: 'name',
    render: text => {
      return <div className={styles.vmBg}>{text}</div>
    }
  },
  {
    title: '主机IP',
    dataIndex: 'hostName'
  },
  {
    title: 'CPU',
    dataIndex: 'cpuUsageRate',
    render: (text, record) => {
      return `${record.datacenterName}/${record.clusterName}`
    }
  },
  {
    title: '内存',
    dataIndex: 'memoryUsageRate'
  },
  {
    title: '网络',
    dataIndex: 'networkUsageRate',
    render: text => {
      if (text == '0') {
        return (
          <span>
            <Icon type="lock" className={styles.lock} /> 锁定
          </span>
        )
      } else {
        return (
          <span className={styles['can-use']}>
            <Icon type="check-circle" /> 可用
          </span>
        )
      }
    }
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '桌面总数',
    dataIndex: 'desktopCount',
    render: text => {
      return <div className={styles.vmBg}>{text}</div>
    }
  }
]
export const apiMethodCompute = resourceApi.listCompute
