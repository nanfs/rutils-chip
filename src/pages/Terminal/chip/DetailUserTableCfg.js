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
        (record.lastname === 'null' ? '' : record.lastname) +
        (record.firstname === 'null' ? '' : record.firstname)
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
