import accessApi from '@/services/access'
// TODO antd 样式加载问题
const typeArr = ['按周', '按日期']
function renderDateText(text) {
  if (text === undefined || text === null) {
    return ''
  }
  if (text.includes('<>')) {
    return text.replace('<>', '~')
  }
  const weekArr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return text
    .split(',')
    .map(item => weekArr[item])
    .join(',')
}
export const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '已绑定终端数',
    width: 120,
    dataIndex: 'boundTcNum'
  },
  {
    title: '准入类型',
    dataIndex: 'type',
    render: (text, record) => {
      return typeArr[record.admitInterval[0].type]
    }
  },
  {
    title: '日期',
    dataIndex: 'date',
    render: (text, record) => {
      return renderDateText(record.admitInterval[0].date)
    }
  },
  {
    title: '时间',
    dataIndex: 'time',
    width: 120,
    render: (text, record) => {
      return `${record.admitInterval[0].startTime} - ${record.admitInterval[0].endTime}`
    }
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
]
export const apiMethod = accessApi.list
