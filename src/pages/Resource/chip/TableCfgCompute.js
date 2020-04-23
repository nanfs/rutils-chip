import React from 'react'
import resourceApi from '@/services/resource'
import { Progress, Tag } from 'antd'
import { hostStatusRender } from '@/utils/tableRender'

export const columnsCompute = [
  {
    title: () => <span title="主机名称">主机名称</span>,
    ellipsis: true,
    dataIndex: 'name'
  },
  {
    title: () => <span title="状态">状态</span>,
    dataIndex: 'status',
    width: 100,
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
    title: () => <span title="主机IP">主机IP</span>,
    ellipsis: true,
    dataIndex: 'ip'
  },
  {
    title: () => <span title="数据中心/集群">数据中心/集群</span>,
    ellipsis: true,
    dataIndex: 'vm',
    render: (text, record) => {
      return `${record.storagePoolName}/${record.clusterName}`
    }
  },
  {
    title: () => <span title="桌面总数">桌面总数</span>,
    width: 120,
    dataIndex: 'numOfDesktop',
    render: text => {
      return <Tag color="blue">{text}</Tag>
    }
  },
  {
    title: () => <span title="CPU">CPU</span>,
    dataIndex: 'usageCpuPercent',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={parseFloat(text)}
          format={() => `${text || 0}%`}
          status={+text < 80 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  },
  {
    title: () => <span title="内存">内存</span>,
    dataIndex: 'usageMemPercent',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={parseFloat(text)}
          format={() => `${text || 0}%`}
          status={+text < 80 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  },
  {
    title: () => <span title="网络">网络</span>,
    dataIndex: 'usageNetworkPercent',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={parseFloat(text)}
          format={() => `${text || 0}%`}
          status={+text < 80 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  },
  {
    title: () => <span title="描述">描述</span>,
    ellipsis: true,
    dataIndex: 'description'
  }
]
export const apiMethodCompute = resourceApi.listCompute
