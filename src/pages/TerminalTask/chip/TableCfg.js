import React from 'react'
import taskApi from '@/services/terminalTask'
import { taskTypeRender, renderSatus } from '@/utils/tableRender'

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
    text: '用户取消',
    icon: 'close-circle',
    color: 'alert'
  },
  {
    value: 5,
    text: '系统自动停止',
    icon: 'check-circle',
    color: 'success'
  }
]
export const columns = [
  {
    title: () => <span title="终端SN">终端SN</span>,
    dataIndex: 'objectId',
    ellipsis: true
  },
  {
    title: () => <span title="任务类型">任务类型</span>,
    dataIndex: 'taskType',
    filters: [
      {
        text: '锁定',
        value: [0]
      },
      {
        text: '解锁',
        value: [1]
      },
      {
        text: '关机',
        value: [2]
      },
      {
        text: '重启',
        value: [3]
      },
      {
        text: '断网',
        value: [4]
      },
      {
        text: '发送消息',
        value: [5]
      },
      {
        text: '设置外设控制',
        value: [6]
      },
      {
        text: '升级',
        value: [7]
      },
      {
        text: '准入超时',
        value: [8]
      },
      {
        text: '编辑终端',
        value: [9]
      }
    ],
    ellipsis: true,
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
    ellipsis: true,
    render: text => renderSatus(status, text)
  },
  {
    title: () => <span title="执行时间">执行时间</span>,
    dataIndex: 'thisTime',
    ellipsis: true
  },
  {
    title: () => <span title="失败次数">失败次数</span>,
    dataIndex: 'failNums',
    ellipsis: true
  },
  {
    title: () => <span title="信息反馈">信息反馈</span>,
    dataIndex: 'failMessage',
    ellipsis: true
  }
]
export const apiMethod = taskApi.list