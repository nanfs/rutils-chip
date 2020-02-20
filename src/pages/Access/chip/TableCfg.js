import accessApi from '@/services/access'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '已绑定数量',
    width: 120,
    dataIndex: 'boundTcNum'
  },
  {
    title: '日期',
    dataIndex: 'date',
    render: (text, record) => {
      return record.admitInterval[0].date
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
