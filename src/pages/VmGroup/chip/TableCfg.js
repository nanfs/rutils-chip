import React from 'react'
import { Popover } from 'antd'
import { MyIcon } from '@/components'
import vmgroupsApi from '@/services/vmgroups'

export const columns = [
  {
    title: () => <span title="桌面数量">桌面数量</span>,
    dataIndex: 'desktopNum',
    ellipsis: true
  },
  {
    title: () => <span title="创建时间">创建时间</span>,
    dataIndex: 'createTime'
  },
  {
    title: () => <span title="名单">预启动设置</span>,
    dataIndex: 'peaks',
    width: 120,
    render: (text, record) => {
      const info = record.peaks?.map((item, index) => (
        <p key={index}>
          startTime{item.startTime} endTime{item.endTime} preStart:
          {item.preStart}
        </p>
      ))
      return info?.length ? (
        <Popover content={info}>
          <MyIcon
            type="order-info"
            component="svg"
            style={{ cursor: 'pointer', fontSize: 18 }}
          />
        </Popover>
      ) : (
        <span>无</span>
      )
    }
  },
  {
    title: () => <span title="描述">描述</span>,
    dataIndex: 'description',
    ellipsis: true
  }
]
export const apiMethod = vmgroupsApi.list
