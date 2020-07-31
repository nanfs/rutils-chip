import diskApi from '@/services/disks'
import React from 'react'
import { Progress } from 'antd'
import { renderSatus } from '@/utils/tableRender'

const runStatus = [
  {
    value: 0,
    text: '未指派的',
    icon: 'api-fill',
    color: 'success',
    status: 'Unassigned'
  },
  {
    value: 1,
    text: '正常',
    icon: 'check-circle-fill',
    color: 'info',
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

const activeStatus = [
  {
    value: true,
    text: '已激活',
    icon: 'check-circle',
    color: 'success'
  },
  {
    value: false,
    text: '未激活',
    icon: 'stop',
    color: 'alert'
  }
]
const isSystem = [
  {
    value: true,
    text: '是',
    icon: 'check-circle',
    color: 'success'
  },
  {
    value: false,
    text: '否',
    icon: 'stop',
    color: 'info'
  }
]
export const columns = [
  {
    title: () => <span title="别名">别名</span>,
    ellipsis: true,
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: () => <span title="是否激活">是否激活</span>,
    ellipsis: true,
    dataIndex: 'active',
    render: text => renderSatus(activeStatus, text, true)
  },
  {
    title: () => <span title="状态">运行状态</span>,
    ellipsis: true,
    dataIndex: 'status',
    render: text => renderSatus(runStatus, text, true)
  },
  {
    title: () => <span title="大小(GB)">大小(GB)</span>,
    key: 'capacity',
    ellipsis: true,
    dataIndex: 'capacity',
    render: (text, record) => {
      return (
        <Progress
          strokeWidth={16}
          percent={(record.actualSize / record.capacity) * 100}
          format={() => `${record.actualSize}G/${record.capacity}G`}
          status={
            +((record.actualSize / record.capacity) * 100) < 80
              ? 'active'
              : 'exception'
          }
        ></Progress>
      )
    }
  },
  {
    title: () => <span title="是否系统盘">是否系统盘</span>,
    ellipsis: true,
    key: 'boot',
    dataIndex: 'isBoot',
    render: text => renderSatus(isSystem, text, true)
  },
  {
    title: () => <span title="描述">描述</span>,
    ellipsis: true,
    key: 'description',
    dataIndex: 'description'
  }
]
export const apiMethod = diskApi.list
