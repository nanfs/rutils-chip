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
    title: '域',
    dataIndex: 'domain'
  }
]
export const apiMethod = usersApi.descrip
