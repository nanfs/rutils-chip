import terminalApi from '@/services/terminal'
// TODO antd 样式加载问题
export const detailAdmitpolicyColumns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
]
export const detailAdmitpolicyApiMethod = terminalApi.list
