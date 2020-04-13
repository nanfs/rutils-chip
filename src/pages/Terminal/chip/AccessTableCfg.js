import accessApi from '@/services/access'
import React from 'react'
import { Tag } from 'antd'

const typeArr = ['按周', '按日期']
const typeOptions = [
  { text: '按周', value: 0 },
  { text: '按日期', value: 1 }
]
function renderDateText(text) {
  if (text === undefined || text === null) {
    return ''
  }
  if (text.includes('<>')) {
    return text.replace('<>', '~')
  }
  const weekArr = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return text
    .split(',')
    .map(item => weekArr[item])
    .join(',')
}
export const columns = [
  {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: () => <span title="已绑定终端数">已绑定终端数</span>,
    ellipsis: true,
    width: 130,
    dataIndex: 'boundTcNum',
    className: 'ellipsis-hasTag',
    render: text => <Tag color="blue">{text}</Tag>
  },
  {
    title: () => <span title="准入类型">准入类型</span>,
    dataIndex: 'type',
    ellipsis: true,
    width: 130,
    filters: typeOptions,
    render: (text, record) => {
      return typeArr[record.admitInterval[0].type]
    }
  },
  {
    title: () => <span title="日期">日期</span>,
    dataIndex: 'date',
    ellipsis: true,
    render: (text, record) => {
      return renderDateText(record.admitInterval[0].date)
    }
  },
  {
    title: () => <span title="时间">时间</span>,
    dataIndex: 'time',
    ellipsis: true,
    render: (text, record) => {
      return `${record.admitInterval[0].startTime} - ${record.admitInterval[0].endTime}`
    }
  },
  {
    title: () => <span title="描述">描述</span>,
    ellipsis: true,
    dataIndex: 'description'
  }
]
export const apiMethod = accessApi.list
