import poolsApi from '@/services/pools'
import React from 'react'
import { Icon, Progress } from 'antd'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '状态',
    dataIndex: 'name'
  },
  {
    title: '管理类型',
    dataIndex: 'manageType',
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
    title: '模板',
    dataIndex: 'templateName'
  },
  {
    title: '正在运行',
    dataIndex: 'runDesktopNum'
  },
  {
    title: '预启动',
    dataIndex: 'prestartNum'
  },
  {
    title: '桌面总数',
    dataIndex: 'desktopNum'
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
]
export const apiMethod = poolsApi.list

export const vmColumns = [
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
    title: '主机',
    dataIndex: 'hostName'
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '上线时间',
    key: 'onlineTime',
    dataIndex: 'onlineTime'
  },
  {
    title: '已分配用户',
    dataIndex: 'assignedUsers'
  },
  {
    title: '控制台状态',
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
export const vmApiMethod = poolsApi.vmList
