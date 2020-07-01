import desktopApi from '@/services/desktops'
import React from 'react'
import { Icon, Popover } from 'antd'

const snapshotStatus = {
  OK: '正常',
  LOCKED: '锁定',
  IN_PREVIEW: '预览中'
}
function renderAppList(text) {
  const list =
    text && text.split(',').map((item, index) => <p key={index}>{item}</p>)
  return list ? (
    <Popover content={list}>
      <Icon
        type="appstore"
        className="table-icon-success"
        style={{ cursor: 'pointer' }}
      />
    </Popover>
  ) : (
    <p>暂未安装</p>
  )
}
export const columns = [
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description',
    ellipsis: true,
    render: text =>
      text === 'Active VM before the preview' ? '预览前的活动虚拟机' : text
  },
  {
    title: () => <span title="快照状态">快照状态</span>,
    ellipsis: true,
    key: 'boot',
    dataIndex: 'status',
    render: text => snapshotStatus[text]
  },
  {
    title: 'CPU',
    key: 'cpu',
    ellipsis: true,
    dataIndex: 'cpu'
  },
  {
    title: '是否保存内存',
    key: 'containsmemory',
    ellipsis: true,
    dataIndex: 'containsmemory',
    render: text =>
      text ? (
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
    title: '内存',
    key: 'memSize',
    dataIndex: 'memSize',
    ellipsis: true,
    render: text => `${text}G`
  },
  {
    title: '已安装程序',
    key: 'appList',
    dataIndex: 'appList',
    ellipsis: true,
    render: text => renderAppList(text)
  },
  {
    title: '创建时间',
    key: 'createTime',
    ellipsis: true,
    dataIndex: 'createTime'
  }
]
export const apiMethod = desktopApi.snapList
