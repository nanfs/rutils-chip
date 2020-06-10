import React from 'react'
import upgradeApi from '@/services/upgrade'
import { Icon, Popover, Tag } from 'antd'
import { MyIcon } from '@/components'

const iconStyle = {
  check: { fontSize: 20, color: '#1789d8' },
  close: { fontSize: 18 }
}
export const columns = [
  {
    title: () => <span title="优先级">优先级</span>,
    dataIndex: 'status',
    width: 150,
    filters: [
      {
        text: '离线',
        value: [0]
      },
      {
        text: '在线',
        value: [1]
      }
    ],
    render: value => {
      return value === 0 ? (
        <MyIcon
          type="tc-offline"
          component="svg"
          title="离线"
          style={{
            fontSize: '20px'
          }}
        />
      ) : (
        <MyIcon
          type="tc-online"
          component="svg"
          title="在线"
          style={{
            fontSize: '20px'
          }}
        />
      )
    }
  },
  {
    title: () => <span title="升级包类型">升级包类型</span>,
    dataIndex: 'sn',
    ellipsis: true
  },
  {
    title: () => <span title="版本号">版本号</span>,
    dataIndex: 'ip',
    ellipsis: true
  },
  {
    title: () => <span title="上传用户">上传用户</span>,
    dataIndex: 'mac',
    ellipsis: true
  },
  {
    title: () => <span title="终端类型">终端类型</span>,
    dataIndex: 'isReg',
    width: 110,
    filters: [
      {
        text: '待接入',
        value: [false]
      },
      {
        text: '已接入',
        value: [true]
      }
    ],
    render: value => {
      return value ? (
        <Tag color="#ade688">已接入</Tag>
      ) : (
        <Tag color="#f3b88b">待接入</Tag>
      )
    }
  },
  {
    title: () => <span title="上传时间">上传时间</span>,
    dataIndex: 'location',
    ellipsis: true
  },

  {
    title: () => <span title="升级日志">升级日志</span>,
    dataIndex: 'numOfSafePolicyBounded',
    render: text => (
      <span className="table-action">
        {text !== 0 ? (
          <Icon type="check" style={iconStyle.check} />
        ) : (
          <Icon type="close" style={iconStyle.close} />
        )}
      </span>
    )
  }
]
export const apiMethod = upgradeApi.list
