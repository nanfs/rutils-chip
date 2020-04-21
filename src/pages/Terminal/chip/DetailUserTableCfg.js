// eslint-disable-next-line import/prefer-default-export
export const detailUserColumns = [
  {
    title: '用户名',
    ellipsis: true,
    dataIndex: 'username',
    render: value => {
      return value.split('@')[0]
    }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    ellipsis: true,
    render: (value, record) => {
      return (
        (record.lastname === 'null' ? '' : record.lastname) +
        (record.firstname === 'null' ? '' : record.firstname)
      )
    }
  },
  {
    title: '组',
    ellipsis: true,
    dataIndex: 'department',
    render: (value, record) => {
      return record.department === 'null' ? '' : record.department
    }
  },
  {
    title: '域',
    ellipsis: true,
    dataIndex: 'domain',
    render: text => {
      return text.replace(/internal-authz/g, '本地组(internal)')
    }
  }
]
