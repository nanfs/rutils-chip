// eslint-disable-next-line import/prefer-default-export
export const detailUserColumns = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    render: (value, record) => {
      return (
        (record.firstname === 'null' ? '' : record.firstname) +
        (record.lastname === 'null' ? '' : record.lastname)
      )
    }
  },
  {
    title: '组',
    dataIndex: 'department',
    render: (value, record) => {
      return record.department === 'null' ? '' : record.department
    }
  },
  {
    title: '域',
    dataIndex: 'domain'
  }
]
