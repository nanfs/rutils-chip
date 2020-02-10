import accessApi from '@/services/access'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '名称',
    dataIndex: 'datetime'
  },
  {
    title: '日期',
    dataIndex: 'content'
  },
  {
    title: '时间',
    dataIndex: 'sn'
  },
  {
    title: '描述',
    dataIndex: 'vip'
  }
]
export const apiMethod = accessApi.list
