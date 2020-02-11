import React from 'react'
import resourceApi from '@/services/resource'
import { Icon, Progress } from 'antd'
import styles from '../index.m.scss'

export const columnsCompute = [
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
    title: '主机名称',
    dataIndex: 'name'
  },
  {
    title: '主机IP',
    dataIndex: 'hostName'
  },
  {
    title: 'CPU',
    dataIndex: 'cpuUsageRate',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={text}
        ></Progress>
      )
    }
  },
  {
    title: '内存',
    dataIndex: 'memoryUsageRate',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={text}
        ></Progress>
      )
    }
  },
  {
    title: '网络',
    dataIndex: 'networkUsageRate',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={text}
        ></Progress>
      )
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
