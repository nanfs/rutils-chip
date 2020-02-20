import vmlogsApi from '@/services/vmlogs'
import { severityOptions, renderServerityOptions } from '@/utils/tableRender'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '级别',
    dataIndex: 'severity',
    filters: severityOptions,
    render: renderServerityOptions,
    onFilter: (value, record) => record.severity === value
  },
  {
    title: '登录时间',
    dataIndex: 'logTime'
  },
  {
    title: '信息',
    dataIndex: 'message'
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
