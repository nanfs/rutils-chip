import diskApi from '@/services/disks'
import React from 'react'
import { Icon } from 'antd'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '磁盘别名',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '大小',
    key: 'capacity',
    dataIndex: 'capacity'
  },
  {
    title: '是否系统盘',
    key: 'boot',
    dataIndex: 'boot',
    render: text =>
      text ? (
        <span>
          <Icon type="check-circle" />
        </span>
      ) : (
        undefined
      )
  },
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description'
  }
]
export const apiMethod = diskApi.list
