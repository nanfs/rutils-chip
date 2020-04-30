import React from 'react'

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
// eslint-disable-next-line import/prefer-default-export
export const DetailAccesspolicyColumns = [
  {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    width: 200,
    ellipsis: true
  },
  {
    title: () => <span title="准入类型">准入类型</span>,
    dataIndex: 'type',
    width: 200,
    ellipsis: true,
    render: (text, record) => {
      return typeArr[record.type]
    }
  },
  {
    title: () => <span title="日期">日期</span>,
    dataIndex: 'date',
    width: 200,
    ellipsis: true,
    render: (text, record) => {
      return renderDateText(record.date)
    }
  },
  {
    title: () => <span title="时间">时间</span>,
    dataIndex: 'time',
    width: 200,
    ellipsis: true,
    render: (text, record) => {
      return `${record.startTime} - ${record.endTime}`
    }
  },
  {
    title: () => <span title="描述">描述</span>,
    ellipsis: true,
    dataIndex: 'description'
  }
]
