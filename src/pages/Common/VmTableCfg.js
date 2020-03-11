import desktopsApi from '@/services/desktops'
import React from 'react'
import { Progress, Icon } from 'antd'
import { vmStatusRender } from '@/utils/tableRender'
import { onlineStringTime } from '@/utils/tool'
import { MyIcon } from '@/components'

const iconStyle = {
  check: { fontSize: 20, color: '#1789d8' },
  close: { fontSize: 18 }
}
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
  // TODO桌面主机列表  筛选 IP
  {
    title: '主机',
    dataIndex: 'hostName',
    render: (text, record) => {
      return `${record.ip}/${record.hostName}`
    }
  },
  // TODO 升降序排序
  {
    title: 'IP',
    dataIndex: 'clientIp'
  },
  {
    title: '数据中心/集群',
    dataIndex: 'datacenterName',
    // TODO 数据中心过滤
    filters: [
      { value: [0, 13], text: '关机' },
      { value: [1], text: '开机' },
      { value: [2, 16, 10, 15, 5, 6, 11, 12, 9], text: '运行' },
      { value: [7, 8, 14, -1, 4], text: '异常' }
    ],
    render: (text, record) => {
      return `${record.datacenterName}/${record.clusterName}`
    }
  },
  {
    title: '已分配用户',
    dataIndex: 'assignedUsers',
    render: text => (
      <span className="table-action">
        {text ? (
          <Icon type="check" style={iconStyle.check} />
        ) : (
          <Icon type="close" style={iconStyle.close} />
        )}
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
    dataIndex: 'onlineTime',
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
          strokeWidth={10}
          percent={+text || 0}
          status={+text < 100 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  }
]
export const apiMethod = desktopsApi.list
