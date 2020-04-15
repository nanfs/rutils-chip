import React from 'react'
import templateApi from '@/services/template'
import { Icon, Tag } from 'antd'
import '../index.less'
import { availableStatusRender } from '@/utils/tableRender'

export const columns = [
  {
    title: () => <span title="状态">状态</span>,
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
        return availableStatusRender('可用')
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
    title: () => <span title="已使用桌面">已使用桌面</span>,
    dataIndex: 'vmUsed',
    width: 120,
    render: text => {
      return <Tag color="blue">{text}</Tag>
    }
  },
  {
    title: () => <span title="父模板">父模板</span>,
    ellipsis: true,
    dataIndex: 'parentName'
  },
  {
    title: () => <span title="数据中心/集群">数据中心/集群</span>,
    ellipsis: true,
    dataIndex: 'vm',
    render: (text, record) => {
      return `${record.datacenterName}/${record.clusterName}`
    }
  },
  {
    title: () => <span title="描述">描述</span>,
    ellipsis: true,
    dataIndex: 'description'
  }
]
export const apiMethod = templateApi.list
