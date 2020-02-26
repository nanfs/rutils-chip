// TODO antd 样式加载问题
// eslint-disable-next-line import/prefer-default-export
export const detailUserColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    render: (value, record) => {
      return record.firstname + record.lastname
    }
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '组',
    dataIndex: 'groupName'
  }
]
