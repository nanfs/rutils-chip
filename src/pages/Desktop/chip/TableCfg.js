import tclogsApi from '@/services/tclogs'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '级别',
    dataIndex: 'severity',
    filters: [
      {
        text: '1',
        value: '1'
      },
      {
        text: '3',
        value: '3'
      }
    ],
    onFilter: (value, record) => record.severity === value
  },
  {
    title: '时间',
    dataIndex: 'datetime'
  },
  {
    title: '信息',
    dataIndex: 'content'
  },
  {
    title: '序列号',
    dataIndex: 'sn'
  },
  {
    title: '终端IP',
    dataIndex: 'vip'
  },
  {
    title: '用户',
    dataIndex: 'username'
  },
  {
    title: '用户IP',
    dataIndex: 'userIp'
  }
]
export const apiMethod = tclogsApi.list
