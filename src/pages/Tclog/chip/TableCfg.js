import tclogsApi from '@/services/tclogs'
import { severityOptions, renderServerityOptions } from '@/utils/tableRender'

export const columns = [
  {
    title: '级别',
    dataIndex: 'severity',
    width: 100,
    filters: severityOptions,
    render: renderServerityOptions
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
