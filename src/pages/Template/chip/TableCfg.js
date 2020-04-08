import React from 'react'
import templateApi from '@/services/template'
import { Icon, Tag } from 'antd'
import '../index.less'

export const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: text => {
      if (text == '1') {
        return (
          <span>
            <Icon type="lock" className="lock" title="锁定" />
          </span>
        )
      } else if (text == '0') {
        return (
          <span className="can-use" title="可用">
            <Icon type="check-circle" />
          </span>
        )
      } else {
        return (
          <span className="safety" title="合法">
            <Icon type="safety" />
          </span>
        )
      }
    }
  },
  {
    title: '已使用桌面',
    dataIndex: 'vmUsed',
    width: 120,
    render: text => {
      return <Tag color="blue">{text}</Tag>
    }
  },
  {
    title: '父模板',
    ellipsis: true,
    dataIndex: 'parentName'
  },
  {
    title: '数据中心/集群',
    ellipsis: true,
    dataIndex: 'vm',
    render: (text, record) => {
      return `${record.datacenterName}/${record.clusterName}`
    }
  },
  {
    title: '描述',
    ellipsis: true,
    dataIndex: 'description'
  }
]
export const apiMethod = templateApi.list
