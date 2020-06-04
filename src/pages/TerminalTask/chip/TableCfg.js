import React from 'react'
import taskApi from '@/services/task'
import { Icon, Tag } from 'antd'
import { availableStatusRender } from '@/utils/tableRender'

const iconStyle = {
  check: { color: '#17abe3' },
  close: { color: '#ff4d4f' }
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
    title: () => <span title="任务类型">任务类型</span>,
    dataIndex: 'name'
  },
  {
    title: () => <span title="生成时间">生成时间</span>,
    dataIndex: 'name'
  },
  {
    title: () => <span title="结束时间">结束时间</span>,
    dataIndex: 'name'
  },
  {
    title: () => <span title="执行次数">执行次数</span>,
    dataIndex: 'name'
  },
  {
    title: () => <span title="执行状态">执行状态</span>,
    dataIndex: 'status',
    render: text => (
      <span className="table-action">
        {text !== 0 ? (
          availableStatusRender('启用')
        ) : (
          <Icon type="stop" style={iconStyle.close} title="停用" />
        )}
      </span>
    )
  },
  {
    title: () => <span title="信息反馈">信息反馈</span>,
    dataIndex: 'name'
  }
]
export const apiMethod = taskApi.list
