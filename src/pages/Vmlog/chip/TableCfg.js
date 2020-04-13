import React from 'react'
import vmlogsApi from '@/services/vmlogs'
import { severityOptions, renderServerityOptions } from '@/utils/tableRender'

export const columns = [
  {
    title: () => <span title="级别">级别</span>,
    dataIndex: 'severity',
    width: 80,
    // defaultFilteredValue: [0, 1, 2, 10],
    filters: severityOptions,
    render: renderServerityOptions
  },
  {
    title: () => <span title="时间">时间</span>,
    dataIndex: 'logTime',
    width: 180,
    ellipsis: true
  },
  {
    title: () => <span title="信息">信息</span>,
    width: '20%',
    dataIndex: 'message',
    ellipsis: true
  },
  {
    title: () => <span title="用户">用户</span>,
    dataIndex: 'userName',
    ellipsis: true
  },

  {
    title: () => <span title="桌面">桌面</span>,
    dataIndex: 'desktopName',
    ellipsis: true
  },
  {
    title: () => <span title="主机">主机</span>,
    dataIndex: 'hostName',
    width: 140,
    ellipsis: true
  },
  {
    title: () => <span title="数据中心">数据中心</span>,
    dataIndex: 'datacenterName',
    width: '9%',
    ellipsis: true
  },
  {
    title: () => <span title="集群">集群</span>,
    dataIndex: 'clusterName',
    ellipsis: true
  }
]
export const apiMethod = vmlogsApi.list
