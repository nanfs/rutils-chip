import React from 'react'
import {
  packageTypeRender,
  upgradeTypeRender,
  priorityLevel
} from '@/utils/tableRender'
import upgradeApi from '@/services/upgrade'
import dayjs from 'dayjs'

export const columns = [
  {
    title: () => <span title="优先级">优先级</span>,
    dataIndex: 'priorityLevel',
    width: 110,
    ellipsis: true,
    render: text => priorityLevel(text)
  },
  {
    title: () => <span title="升级包类型">升级包类型</span>,
    dataIndex: 'packageType',
    ellipsis: true,
    render: text => upgradeTypeRender(text)
  },
  {
    title: () => <span title="版本号">版本号</span>,
    dataIndex: 'version',
    ellipsis: true
  },
  {
    title: () => <span title="终端型号">终端型号</span>,
    dataIndex: 'model',
    ellipsis: true
  },
  {
    title: () => <span title="适用的终端版本">适用的终端版本</span>,
    width: 150,
    dataIndex: 'upgradableVersions',
    ellipsis: true
  },
  {
    title: () => <span title="上传用户">上传用户</span>,
    dataIndex: 'uploaderName',
    ellipsis: true
  },
  {
    title: () => <span title="上传时间">上传时间</span>,
    dataIndex: 'uploadTime',
    ellipsis: true,
    render: text => dayjs(text).format('YYYY-MM-DD HH:mm')
  },

  {
    title: () => <span title="升级日志">升级日志</span>,
    dataIndex: 'log',
    ellipsis: true
  }
]
export const apiMethod = upgradeApi.list