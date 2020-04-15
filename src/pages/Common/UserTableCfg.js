import usersApi from '@/services/user'

export const columns = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '组',
    dataIndex: 'groupname'
  }
]
export const apiMethod = usersApi.descrip
