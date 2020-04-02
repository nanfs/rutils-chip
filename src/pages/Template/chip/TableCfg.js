import React from 'react'
import templateApi from '@/services/template'
import { Icon, Tag } from 'antd'
import '../index.less'

export const columns = [
  {
    title: '已使用桌面',
    dataIndex: 'vmUsed',
    width: 120,
    render: text => {
      return <Tag>{text}</Tag>
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
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: text => {
      if (text == '1') {
        return (
          <span>
            <Icon type="lock" className="lock" /> 锁定
          </span>
        )
      } else if (text == '0') {
        return (
          <span className="can-use">
            <Icon type="check-circle" /> 可用
          </span>
        )
      } else {
        return (
          <span className="safety">
            <Icon type="safety" /> 合法
          </span>
        )
      }
    }
  }
]
export const apiMethod = templateApi.list
