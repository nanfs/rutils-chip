import desktopsApi from '@/services/desktops'
import React from 'react'
import { Icon, Progress } from 'antd'
// TODO antd 样式加载问题
export const columns = [
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
    onFilter: (value, record) => record.severity === value
  },
  {
    title: '基本信息',
    dataIndex: 'name',
    render: (text, record) => {
      return `${record.os} ${record.name}`
    }
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '主机',
    dataIndex: 'hostName'
  },
  {
    title: '数据中心/集群',
    dataIndex: 'datacenterName',
    render: (text, record) => {
      return `${record.datacenterName}/${record.clusterName}`
    }
  },
  {
    title: '已分配用户',
    dataIndex: 'assignedUsers'
  },
  {
    title: '控制台',
    dataIndex: 'isConsole',
    render: (text, record) => {
      const consoleContent = record.consoleUserName ? (
        <div>
          <Icon type="linked" />
          <span>已连接</span>{' '}
        </div>
      ) : (
        <div>
          <Icon type="unlinked" />
          <span>未连接</span>
        </div>
      )
      return consoleContent
    }
  },
  {
    title: '本次运行时长',
    key: 'onlineTime',
    dataIndex: 'onlineTime'
  },
  {
    title: 'CPU',
    dataIndex: 'cpuUsageRate',
    render: (text, record) => {
      return (
        <Progress
          strokeWidth={16}
          percent={record.cpuUsageRate || 0}
        ></Progress>
      )
    }
  },
  {
    title: '内存',
    dataIndex: 'memoryUsageRate',
    render: (text, record) => {
      return (
        <Progress
          strokeWidth={16}
          percent={record.memoryUsageRate || 0}
        ></Progress>
      )
    }
  },
  {
    title: '网络',
    dataIndex: 'networkUsageRate',
    render: (text, record) => {
      return (
        <Progress
          strokeWidth={16}
          percent={record.networkUsageRate || 0}
        ></Progress>
      )
    }
  }
]
export const apiMethod = desktopsApi.list
