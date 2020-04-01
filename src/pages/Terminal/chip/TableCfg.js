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
    title: '状态',
    dataIndex: 'status',
    width: 100,
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
    // onFilter: (value, record) => record.status === value,
    render: value => {
      return value === 0 ? (
        <Popover content={'离线'}>
          <MyIcon
            type="tc-offline"
            component="svg"
            style={{
              fontSize: '20px'
              // color: value === 0 ? '#ccc' : '#1890ff'
            }}
          />
        </Popover>
      ) : (
        <Popover content={'在线'}>
          <MyIcon
            type="tc-online"
            component="svg"
            style={{
              fontSize: '20px'
              // color: value === 0 ? '#ccc' : '#1890ff'
            }}
          />
        </Popover>
      )
    }
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    ellipsis: true
  },
  {
    title: 'Mac',
    dataIndex: 'mac',
    ellipsis: true
  },
  {
    title: '接入状态',
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
    // onFilter: (value, record) => record.isReg === value,
    render: value => {
      return value ? (
        <Tag color="#ade688">已接入</Tag>
      ) : (
        <Tag color="#f3b88b">待接入</Tag>
      )
    }
  },
  {
    title: 'sn',
    dataIndex: 'sn',
    ellipsis: true
  },
  {
    title: '位置',
    dataIndex: 'location',
    ellipsis: true
  },

  {
    title: '外设控制',
    width: 100,
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
  },
  {
    title: '准入控制',
    width: 100,
    dataIndex: 'numOfAdmitPolicyBounded',
    render: text => (
      <span className="table-action">
        {text !== 0 ? (
          <Icon type="check" style={iconStyle.check} />
        ) : (
          <Icon type="close" style={iconStyle.close} />
        )}
      </span>
    )
  },
  {
    title: '分配用户',
    width: 100,
    dataIndex: 'numOfUserBounded',
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
