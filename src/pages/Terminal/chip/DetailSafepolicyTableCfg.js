import terminalApi from '@/services/terminal'
// TODO antd 样式加载问题
export const detailSafepolicyColumns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
]
export const detailSafepolicyApiMethod = terminalApi.list
