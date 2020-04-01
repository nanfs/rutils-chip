import tclogsApi from '@/services/tclogs'
import { severityOptions, renderServerityOptions } from '@/utils/tableRender'

export const columns = [
  {
    title: '级别',
    dataIndex: 'severity',
    width: 70,
    defaultFilteredValue: [0, 1, 2, 10],
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
    dataIndex: 'message',
    width: '20%',
    ellipsis: true
  },
  {
    title: '终端SN',
    dataIndex: 'tcSn',
    width: '20%',
    ellipsis: true
  },
  {
    title: '终端IP',
    dataIndex: 'tcIp',
    ellipsis: true
  },
  {
    title: '用户',
    dataIndex: 'userName',
    ellipsis: true
  },
  {
    title: '用户IP',
    dataIndex: 'userIp',
    width: '10%',
    ellipsis: true
  }
]
export const apiMethod = tclogsApi.list
