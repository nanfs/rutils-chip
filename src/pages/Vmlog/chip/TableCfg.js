import vmlogsApi from '@/services/vmlogs'
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
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '桌面',
    dataIndex: 'desktopName'
  },
  {
    title: '主机',
    dataIndex: 'hostName'
  },
  {
    title: '数据中心',
    dataIndex: 'datacenterName'
  },
  {
    title: '群集',
    dataIndex: 'clusterName'
  }
]
export const apiMethod = vmlogsApi.list
