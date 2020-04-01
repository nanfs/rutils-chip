import desktopsApi from '@/services/desktops'
import React from 'react'
import { Progress, Icon, Popover } from 'antd'
import {
  vmStatusRender,
  osIconRender,
  osTextRender,
  assignedUsersRender
} from '@/utils/tableRender'
import { onlineStringTime } from '@/utils/tool'
import { MyIcon } from '@/components'
import {
  setClusterToSession,
  setDataCenterToSession,
  setHostToSession
} from '@/utils/storage'

// TODO 会有不同步问题 后期优化
setClusterToSession()
setDataCenterToSession()
setHostToSession()
export const columns = [
  {
    title: '操作系统',
    dataIndex: 'os',
    render: text => {
      return (
        <span>
          {osIconRender(text)} {osTextRender(text)}
        </span>
      )
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    // defaultFilteredValue: [
    //   [0, 13],
    //   [1],
    //   [2, 16, 10, 15, 5, 6, 11, 12, 9],
    //   [7, 8, 14, -1, 4]
    // ],
    filters: [
      { value: [0, 13], text: '关机' },
      { value: [1], text: '开机' },
      { value: [2, 16, 10, 15, 5, 6, 11, 12, 9], text: '运行' },
      { value: [7, 8, 14, -1, 4], text: '异常' }
    ],
    render: text => vmStatusRender(text)
  },
  {
    title: '主机',
    ellipsis: true,
    dataIndex: 'hostName',
    // defaultFilteredValue: JSON.parse(sessionStorage.getItem('hosts')).map(
    //   item => {
    //     return item.value
    //   }
    // ),
    filters: JSON.parse(sessionStorage.getItem('hosts'))
  },
  {
    title: 'IP',
    ellipsis: true,
    dataIndex: 'ip',
    sorter: true
  },
  {
    title: '数据中心',
    ellipsis: true,
    dataIndex: 'datacenterName',
    // defaultFilteredValue: JSON.parse(sessionStorage.getItem('datacenters')).map(
    //   item => {
    //     return item.value
    //   }
    // ),
    filters: JSON.parse(sessionStorage.getItem('datacenters'))
  },
  {
    title: '集群',
    ellipsis: true,
    dataIndex: 'clusterName',
    // defaultFilteredValue: JSON.parse(sessionStorage.getItem('clusters')).map(
    //   item => {
    //     return item.value
    //   }
    // ),
    filters: JSON.parse(sessionStorage.getItem('clusters'))
  },
  {
    title: '已分配用户',
    // ellipsis: true,
    dataIndex: 'assignedUsers',
    render: text => assignedUsersRender(text)
  },
  {
    title: '控制台',
    dataIndex: 'isConsole',
    width: 100,
    render: (text, record) => {
      const consoleContent = record.consoleUserName ? (
        <Popover content={record.consoleUserName}>
          <MyIcon type="tc-connecting" component="svg" />
          <span>已连接</span>
        </Popover>
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
    dataIndex: 'onlineTime',
    sorter: true,
    render: text => onlineStringTime(text)
  },
  {
    title: 'CPU',
    dataIndex: 'cpuUsageRate',
    render: text => {
      return (
        <Progress
          strokeWidth={16}
          percent={+text || 0}
          status={+text < 100 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  },
  {
    title: '内存',
    dataIndex: 'memoryUsageRate',
    render: text => {
      return (
        <Progress
          strokeWidth={16}
          percent={+text || 0}
          status={+text < 100 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  },
  {
    title: '网络',
    dataIndex: 'networkUsageRate',
    render: text => {
      return (
        <Progress
          strokeWidth={16}
          percent={+text || 0}
          status={+text < 100 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  }
]
export const apiMethod = desktopsApi.list
