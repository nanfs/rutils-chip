import React from 'react'
import taskApi from '@/services/task'
import { Icon, Tag } from 'antd'

const iconStyle = {
  check: { color: '#1789d8' },
  close: { color: 'red' }
}
const weekCh = {
  MON: '周一',
  TUE: '周二',
  WED: '周三',
  THU: '周四',
  FRI: '周五',
  SAT: '周六',
  SUN: '周日'
}
export const columns = [
  {
    title: () => <span title="状态">状态</span>,
    dataIndex: 'status',
    render: text => (
      <span className="table-action">
        {text !== 0 ? (
          <Icon type="check-circle" style={iconStyle.check} title="启用" />
        ) : (
          <Icon type="stop" style={iconStyle.close} title="停用" />
        )}
      </span>
    )
  },
  {
    title: () => <span title="桌面数量">桌面数量</span>,
    dataIndex: 'objectCount',
    render: text => <Tag color="blue">{text}</Tag>
  },
  {
    title: () => <span title="任务类型">任务类型</span>,
    dataIndex: 'taskType',
    render: text => (
      <span className="table-action">
        {text == 1 ? <span>定时关机</span> : <span>定时开机</span>}
      </span>
    )
  },
  {
    title: () => <span title="执行周期">执行周期</span>,
    dataIndex: 'cron',
    render: text => {
      const str = text.split(' ')
      const weeks =
        str[3] === '?'
          ? str[str.length - 1]
              .split(',')
              .map(item => weekCh[item])
              .join(',')
          : '每天'
      return <span>{weeks}</span>
    }
  },
  {
    title: () => <span title="执行时间">执行时间</span>,
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
    title: () => <span title="创建时间">创建时间</span>,
    dataIndex: 'createTime',
    ellipsis: true
  },
  {
    title: () => <span title="最后编辑">最后编辑</span>,
    dataIndex: 'updateTime'
  }
]
export const apiMethod = taskApi.list
