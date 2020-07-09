import React from 'react'
import { taskTypeRender, renderSatus } from '@/utils/tableRender'

// eslint-disable-next-line import/prefer-default-export
const status = [
  {
    value: 0,
    text: '未执行',
    icon: 'shalou',
    color: 'warn',
    iconComp: 'MyIcon'
  },
  {
    value: 1,
    text: '执行中',
    icon: 'shalou-copy',
    color: 'info',
    iconComp: 'MyIcon'
  },
  {
    value: 2,
    text: '执行成功',
    icon: 'check-circle',
    color: 'success'
  },
  {
    value: 3,
    text: '执行失败',
    icon: 'close-circle',
    color: 'alert'
  },
  {
    value: 4,
    text: '用户取消终端升级任务',
    icon: 'close-circle',
    color: 'alert'
  }
]

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
    render: text => renderSatus(status, text)
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
