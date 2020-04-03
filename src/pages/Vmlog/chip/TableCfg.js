import vmlogsApi from '@/services/vmlogs'
import { severityOptions, renderServerityOptions } from '@/utils/tableRender'

export const columns = [
  {
    title: '级别',
    dataIndex: 'severity',
    width: 80,
    // defaultFilteredValue: [0, 1, 2, 10],
    filters: severityOptions,
    render: renderServerityOptions
  },
  {
    title: '时间',
    dataIndex: 'logTime',
    width: 160,
    ellipsis: true
  },
  {
    title: '信息',
    width: '20%',
    dataIndex: 'message',
    ellipsis: true
  },
  {
    title: '用户',
    dataIndex: 'userName',
    ellipsis: true
  },

  {
    title: '桌面',
    dataIndex: 'desktopName',
    ellipsis: true
  },
  {
    title: '主机',
    dataIndex: 'hostName',
    width: 140,
    ellipsis: true
  },
  {
    title: '数据中心',
    dataIndex: 'datacenterName',
    width: '9%',
    ellipsis: true
  },
  {
    title: '集群',
    dataIndex: 'clusterName',
    ellipsis: true
  }
]
export const apiMethod = vmlogsApi.list
