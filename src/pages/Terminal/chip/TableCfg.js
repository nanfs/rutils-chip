import React from 'react'
import terminalApi from '@/services/terminal'
import { Icon, Popover, Tag } from 'antd'
import { MyIcon } from '@/components'

const iconStyle = {
  check: { fontSize: 20, color: '#1789d8' },
  close: { fontSize: 18 }
}
export const columns = [
  {
    title: () => <span title="状态">状态</span>,
    dataIndex: 'status',
    width: 80,
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
    title: () => <span title="SN(序列号)">SN(序列号)</span>,
    dataIndex: 'sn',
    ellipsis: true
  },
  {
    title: () => <span title="IP">IP</span>,
    dataIndex: 'ip',
    ellipsis: true
  },
  {
    title: () => <span title="物理地址">物理地址</span>,
    dataIndex: 'mac',
    ellipsis: true
  },
  {
    title: () => <span title="接入状态">接入状态</span>,
    dataIndex: 'isReg',
    width: 100,
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
  /* {
    title: () => <span title="位置">位置</span>,
    dataIndex: 'location',
    ellipsis: true
  }, */
  {
    title: () => <span title="外设控制">外设控制</span>,
    width: 90,
    dataIndex: 'numOfSafePolicyBounded',
    render: text => (
      <span className="table-action">
        {text !== 0 ? (
          <Icon type="check" style={iconStyle.check} />
        ) : (
          <Icon type="close" className="table-icon-warn" />
        )}
      </span>
    )
  },
  {
    title: () => <span title="准入控制">准入控制</span>,
    width: 90,
    dataIndex: 'numOfAdmitPolicyBounded',
    render: text => (
      <span className="table-action">
        {text !== 0 ? (
          <Icon type="check" style={iconStyle.check} />
        ) : (
          <Icon type="close" className="table-icon-warn" />
        )}
      </span>
    )
  },
  {
    title: () => <span title="分配用户">分配用户</span>,
    width: 90,
    dataIndex: 'numOfUserBounded',
    render: text => (
      <span className="table-action">
        {text !== 0 ? (
          <Icon type="check" style={iconStyle.check} />
        ) : (
          <Icon type="close" className="table-icon-warn" />
        )}
      </span>
    )
  }
  /* {
    title: '使用时间',
    key: 'userTime',
    render: (text, record) => (
      <span>
        <Popover
          placement="bottomRight"
          content={
            <div>
              <p>{`上线：${record.onlinetime.replace(/,/g, ' ')}`}</p>
              <p>{`下线：${record.offlinetime.replace(/,/g, ' ')}`}</p>
            </div>
          }
          title="使用时间"
        >
          <Icon type="clock-circle" />
        </Popover>
      </span>
    )
  } */
]
export const apiMethod = terminalApi.list
