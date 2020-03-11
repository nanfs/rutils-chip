import vmlogsApi from '@/services/vmlogs'
import { severityOptions, renderServerityOptions } from '@/utils/tableRender'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '级别',
    dataIndex: 'severity',
    width: 70,
    filters: severityOptions,
    render: renderServerityOptions
  },
  {
    title: '时间',
    dataIndex: 'logTime',
    ellipsis: true
  },
  {
    title: '信息',
    width: '30%',
    dataIndex: 'message',
    ellipsis: true
  },
  {
    title: 'IP',
    dataIndex: 'userIp',
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
    ellipsis: true
  },
  {
    title: '集群',
    dataIndex: 'clusterName',
    ellipsis: true
  }
]
export const apiMethod = vmlogsApi.list
