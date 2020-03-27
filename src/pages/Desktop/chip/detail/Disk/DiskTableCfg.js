import diskApi from '@/services/disks'
import React from 'react'
import { Icon, Progress } from 'antd'
import { renderSatus } from '@/utils/tableRender'

const diskStaus = [
  {
    value: 0,
    text: '未指派的',
    icon: 'api-fill',
    color: 'info',
    status: 'Unassigned'
  },
  {
    value: 1,
    text: '正常',
    icon: 'check-circle-fill',
    color: 'success',
    status: 'OK'
  },
  {
    value: 2,
    text: '锁定',
    icon: 'lock-fill',
    color: 'warn',
    status: 'LOCKED'
  },
  {
    value: 4,
    text: '非法',
    icon: 'close-circle-fill',
    color: 'alert',
    status: 'ILLEGAL'
  }
]
export const columns = [
  {
    title: '别名',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '大小(GB)',
    key: 'capacity',
    dataIndex: 'capacity',
    render: (text, record) => {
      return (
        <Progress
          strokeWidth={16}
          percent={(record.actualSize / record.capacity) * 100}
          format={() => `${record.actualSize}G/${record.capacity}G`}
          status={
            record.actualSize !== record.capacity ? 'active' : 'exception'
          }
        ></Progress>
      )
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: text => renderSatus(diskStaus, text, true)
  },
  {
    title: '是否系统盘',
    key: 'boot',
    dataIndex: 'isBoot',
    render: text => (text ? <Icon type="check-circle" /> : '否')
  },
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description'
  }
]
export const apiMethod = diskApi.list
