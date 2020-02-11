import terminalApi from '@/services/terminal'
// TODO antd 样式加载问题
export const detailUserColumns = [
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '组',
    dataIndex: 'content'
  }
]
export const detailUserApiMethod = terminalApi.list
