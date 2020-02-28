import vmlogsApi from '@/services/vmlogs'
import { severityOptions, renderServerityOptions } from '@/utils/tableRender'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '级别',
    dataIndex: 'severity',
    filters: severityOptions,
    render: renderServerityOptions
  },
  {
    title: '时间',
    dataIndex: 'logTime'
  },
  {
    title: '信息',
    width: '30%',
    dataIndex: 'message'
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '用户',
    dataIndex: 'userName'
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
    title: '集群',
    dataIndex: 'clusterName'
  }
]
export const apiMethod = vmlogsApi.list
