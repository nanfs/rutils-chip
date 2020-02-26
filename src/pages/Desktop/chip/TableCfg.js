import desktopsApi from '@/services/desktops'
import React from 'react'
import { Progress, Icon } from 'antd'
import { vmStatusRender, osStatusRender } from '@/utils/tableRender'
import MyIcon from '@/components/MyIcon'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    filters: [
      { value: [0, 13], text: '关机' },
      { value: [1], text: '开机' },
      { value: [2, 16, 10, 15, 5, 6, 11, 12, 9], text: '运行' },
      { value: [7, 8, 14, -1, 4], text: '异常' }
    ],
    render: text => vmStatusRender(text)
  },
  {
    title: '基本信息',
    dataIndex: 'name',
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
    dataIndex: 'assignedUsers',
    render: text => (
      <span className="table-action">
        {text ? <Icon type="check" /> : <Icon type="close" />}
      </span>
    )
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
