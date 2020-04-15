import React from 'react'
import tclogsApi from '@/services/tclogs'
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
    dataIndex: 'message',
    width: '20%',
    ellipsis: true
  },
  {
    title: () => <span title="终端SN">终端SN</span>,
    dataIndex: 'tcSn',
    width: '20%',
    ellipsis: true
  },
  {
    title: () => <span title="终端IP">终端IP</span>,
    dataIndex: 'tcIp',
    ellipsis: true
  },
  {
    title: () => <span title="用户">用户</span>,
    dataIndex: 'userName',
    ellipsis: true
  },
  {
    title: () => <span title="用户IP">用户IP</span>,
    dataIndex: 'userIp',
    width: '10%',
    ellipsis: true
  }
]
export const apiMethod = tclogsApi.list
