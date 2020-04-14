import React from 'react'
import desktopsApi from '@/services/desktops'

export const columns = [
  {
    title: '桌面名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '集群',
    dataIndex: 'clusterName',
    ellipsis: true,
    filters: JSON.parse(sessionStorage.getItem('clusters'))
  },
  {
    title: '数据中心',
    dataIndex: 'datacenterName',
    ellipsis: true,
    filters: JSON.parse(sessionStorage.getItem('datacenters'))
  }
]
export const apiMethod = desktopsApi.list
