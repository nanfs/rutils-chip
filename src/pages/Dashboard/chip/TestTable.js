import taskApi from '@/services/task'
import React from 'react'

export const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    filters: [
      {
        text: '1',
        value: '1'
      },
      {
        text: '3',
        value: '3'
      }
    ],
    onFilter: (value, record) => record.status === value
  },
  {
    title: '任务内容',
    dataIndex: 'content'
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    sorter: (a, b) => a.priority > b.priority,
    sortDirections: ['descend']
  },
  {
    title: '进度',
    dataIndex: 'progress',
    sorter: (a, b) => a.progress > b.progress,
    sortDirections: ['descend']
  },
  {
    title: '开始时间',
    dataIndex: 'startTime'
  },
  {
    title: '截止时间',
    dataIndex: 'deadline'
  },
  {
    title: '更新时间',
    dataIndex: 'progressUpdateTime'
  },
  {
    title: '项目名称',
    dataIndex: 'projectName'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  }
]
export const apiMethod = taskApi.list

export const expandedRowRender = record => <p>{record.personLiableName}</p>
