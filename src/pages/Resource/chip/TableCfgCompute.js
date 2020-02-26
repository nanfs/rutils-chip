import React from 'react'
import resourceApi from '@/services/resource'
import { Progress } from 'antd'
import styles from '../index.m.scss'
import { hostStatusRender } from '@/utils/tableRender'

export const columnsCompute = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 144,
    filters: [
      {
        text: '关机',
        value: [1]
      },
      {
        text: '维护',
        value: [2]
      },
      {
        text: '开机',
        value: [3]
      },
      {
        text: '待批准',
        value: [11]
      },
      {
        text: '其他',
        value: [0, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15]
      }
    ],
    render: text => hostStatusRender(text)
  },
  {
    title: '主机名称',
    dataIndex: 'name'
  },
  {
    title: '主机IP',
    dataIndex: 'ip'
  },
  {
    title: 'CPU',
    dataIndex: 'usageCpuPercent',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={parseFloat(text)}
        ></Progress>
      )
    }
  },
  {
    title: '内存',
    dataIndex: 'usageMemPercent',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={parseFloat(text)}
        ></Progress>
      )
    }
  },
  {
    title: '网络',
    dataIndex: 'usageNetworkPercent',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={parseFloat(text)}
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
    dataIndex: 'numOfDesktop',
    render: text => {
      return <div className={styles.vmBg}>{text}</div>
    }
  }
]
export const apiMethodCompute = resourceApi.listCompute
