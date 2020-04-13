import React from 'react'
import taskApi from '@/services/task'
import { Icon, Tag } from 'antd'

const iconStyle = {
  check: { color: '#1789d8' },
  close: { color: 'red' }
}
export const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    render: text => (
      <span className="table-action">
        {text !== 0 ? (
          <Icon type="check-circle" style={iconStyle.check} title="允许" />
        ) : (
          <Icon type="stop" style={iconStyle.close} title="禁用" />
        )}
      </span>
    )
  },
  {
    title: '任务类型',
    dataIndex: 'taskType',
    render: text => (
      <span className="table-action">
        {text == 1 ? <span>定时关机</span> : <span>定时开机</span>}
      </span>
    )
  },
  {
    title: '执行时间',
    dataIndex: 'cron',
    render: text => {
      const str = text.split(' ')
      return (
        <span>
          {str[2]}:{str[1]}
        </span>
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    ellipsis: true
  },
  {
    title: '最后编辑',
    dataIndex: 'updateTime'
  },
  {
    title: '执行对象',
    dataIndex: 'objectCount',
    render: text => <Tag>{text}</Tag>
  }
]
export const apiMethod = taskApi.list
