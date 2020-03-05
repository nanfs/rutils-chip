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
    dataIndex: 'logTime'
  },
  {
    title: '信息',
    dataIndex: 'message',
    width: '30%',
    ellipsis: true
  },
  {
    title: '终端SN',
    dataIndex: 'tcSn'
  },
  {
    title: '终端IP',
    dataIndex: 'tcIp'
  },
  {
    title: '用户',
    dataIndex: 'userName'
  },
  {
    title: '用户IP',
    dataIndex: 'userIp'
  }
]
export const apiMethod = tclogsApi.list
