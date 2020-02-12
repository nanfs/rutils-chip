import desktopsApi from '@/services/desktops'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '用户名',
    dataIndex: 'username',
    render: (text, record) => {
      return `${record.os} ${record.name}`
    }
  },
  {
    title: '组',
    dataIndex: 'group'
  }
]
export const apiMethod = desktopsApi.list
