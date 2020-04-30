import usersApi from '@/services/user'

export const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 300
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 300
  },
  {
    title: '组',
    dataIndex: 'groupname'
  }
]
export const apiMethod = usersApi.descrip
