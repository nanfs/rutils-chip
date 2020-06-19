import React from 'react'
import { taskTypeRender, taskStatusRender } from '@/utils/tableRender'

// eslint-disable-next-line import/prefer-default-export
export const detailTasksColumns = [
  {
    title: () => <span title="任务类型">任务类型</span>,
    dataIndex: 'taskType',
    render: text => taskTypeRender(text)
  },
  {
    title: () => <span title="生成时间">生成时间</span>,
    dataIndex: 'createTime',
    ellipsis: true
  },
  {
    title: () => <span title="执行状态">执行状态</span>,
    dataIndex: 'status',
    render: text => taskStatusRender(text)
  },
  {
    title: () => <span title="执行时间">执行时间</span>,
    dataIndex: 'thisTime',
    ellipsis: true
  },
  {
    title: () => <span title="失败次数">失败次数</span>,
    dataIndex: 'failNums'
  },
  {
    title: () => <span title="信息反馈">信息反馈</span>,
    dataIndex: 'failMessage',
    ellipsis: true
  }
]
