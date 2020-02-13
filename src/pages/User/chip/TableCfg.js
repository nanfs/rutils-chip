import React from 'react'
import terminalApi from '@/services/terminal'
import { Icon, Popover } from 'antd'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    filters: [
      {
        text: '1',
        value: '1'
      },
      {
        text: '3',
        value: '3'
      }
    ],
    onFilter: (value, record) => record.severity === value
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '接入状态',
    dataIndex: 'content'
  },
  {
    title: '位置',
    dataIndex: 'location'
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '安全策略',
    dataIndex: 'safepolicy',
    render: text => (
      <span className="table-action">
        {text ? <Icon type="check" /> : <Icon type="close" />}
      </span>
    )
  },
  {
    title: '准入策略',
    dataIndex: 'admitpolicy',
    render: text => (
      <span className="table-action">
        {text ? <Icon type="check" /> : <Icon type="close" />}
      </span>
    )
  },
  {
    title: '分配用户',
    dataIndex: 'authorizationUserName',
    render: text => (
      <span className="table-action">
        {text ? <Icon type="check" /> : <Icon type="close" />}
      </span>
    )
  },
  {
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
  }
]
export const apiMethod = terminalApi.list
