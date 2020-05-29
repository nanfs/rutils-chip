import desktopApi from '@/services/desktops'
import React from 'react'
import { Icon } from 'antd'

export const columns = [
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description'
  },
  {
    title: () => <span title="是否活动快照">是否为活动快照</span>,
    ellipsis: true,
    key: 'boot',
    dataIndex: 'snapshotType',
    render: text =>
      text === 'ACTIVE' ? (
        <span>
          <Icon type="check-circle" className="table-icon-info" />
          &nbsp;是
        </span>
      ) : (
        <span>
          <Icon
            type="stop"
            title="否"
            style={{
              color: '#ff4d4f'
            }}
          />
          &nbsp;否
        </span>
      )
  },
  {
    title: 'CPU',
    key: 'cpu',
    dataIndex: 'cpu'
  },
  {
    title: '内存',
    key: 'memSize',
    dataIndex: 'memSize',
    render: text => `${text}G`
  },
  {
    title: '已安装程序',
    key: 'appList',
    dataIndex: 'appList'
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime'
  }
]
export const apiMethod = desktopApi.snapList
