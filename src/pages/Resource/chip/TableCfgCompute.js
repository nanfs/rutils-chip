import React from 'react'
import resourceApi from '@/services/resource'
import { Progress, Tag } from 'antd'
import { hostStatusRender } from '@/utils/tableRender'

export const columnsCompute = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    defaultFilteredValue: [
      [2],
      [1],
      [3],
      [11],
      [0, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15]
    ],
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
    ellipsis: true,
    dataIndex: 'name'
  },
  {
    title: '主机IP',
    ellipsis: true,
    dataIndex: 'ip'
  },
  {
    title: '数据中心/集群',
    ellipsis: true,
    dataIndex: 'vm',
    render: (text, record) => {
      return `${record.storagePoolName}/${record.clusterName}`
    }
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
          status={+text < 100 ? 'active' : 'exception'}
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
          strokeWidth={16}
          percent={parseFloat(text)}
          status={+text < 100 ? 'active' : 'exception'}
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
          strokeWidth={16}
          percent={parseFloat(text)}
          status={+text < 100 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  },
  {
    title: '描述',
    ellipsis: true,
    dataIndex: 'description'
  },
  {
    title: '桌面总数',
    width: 100,
    dataIndex: 'numOfDesktop',
    render: text => {
      return <Tag>{text}</Tag>
    }
  }
]
export const apiMethodCompute = resourceApi.listCompute
