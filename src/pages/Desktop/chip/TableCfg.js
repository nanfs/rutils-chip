import desktopsApi from '@/services/desktops'
import React from 'react'
import { Progress } from 'antd'
import { vmStatusRender, osStatusRender } from '@/utils/tableRender'
import MyIcon from '@/components/MyIcon'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    filters: [
      { value: -1, text: '未指派的' },
      { value: 0, text: '关机' },
      { value: 1, text: '开机' },
      { value: 2, text: '正在开机' },
      { value: 4, text: '暂停' },
      { value: 5, text: '迁移出' },
      { value: 6, text: '迁移入' },
      { value: 7, text: '未知' },
      { value: 8, text: '没有响应' },
      { value: 9, text: '等待' },
      { value: 10, text: '重启过程中' },
      { value: 11, text: '保存状态' },
      { value: 12, text: '恢复状态' },
      { value: 13, text: '挂起' },
      { value: 14, text: '镜像损坏' },
      { value: 15, text: '镜像锁定' },
      { value: 16, text: '正在关机' }
    ],
    onFilter: (value, record) => record.severity === value,
    render: text => vmStatusRender(text)
  },
  {
    title: '基本信息',
    dataIndex: 'name',
    width: 100,
    render: (text, record) => {
      return (
        <span>
          {osStatusRender(record.os)}
          {record.name}
        </span>
      )
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
    width: 100,
    render: (text, record) => {
      const consoleContent = record.consoleUserName ? (
        <div>
          <MyIcon type="tc-connecting" component="svg" />
          <span>已连接</span>{' '}
        </div>
      ) : (
        <div>
          <MyIcon type="storage-unattached" component="svg" />
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
    render: text => {
      return <Progress strokeWidth={16} percent={+text || 0}></Progress>
    }
  },
  {
    title: '内存',
    dataIndex: 'memoryUsageRate',
    render: text => {
      return <Progress strokeWidth={16} percent={+text || 0}></Progress>
    }
  },
  {
    title: '网络',
    dataIndex: 'networkUsageRate',
    render: text => {
      return <Progress strokeWidth={16} percent={+text || 0}></Progress>
    }
  }
]
export const apiMethod = desktopsApi.list
