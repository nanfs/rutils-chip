import React from 'react'
import userApi from '@/services/user'
import { Icon, Tag } from 'antd'
import { MyIcon } from '@/components'

export const adColumns = [
  {
    title: '姓名',
    dataIndex: 'name'
    /* render: (value, record) => {
      return (
        (record.lastname === null ? '' : record.lastname) +
        (record.firstname === null ? '' : record.firstname)
      )
    } */
  },
  /* {
    title: '邮件',
    dataIndex: 'email'
  }, */
  {
    title: '已分配桌面数',
    dataIndex: 'vmcount',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: '已分配终端数',
    dataIndex: 'tccount',
    render: text => <Tag>{text}</Tag>
  }
]
export const apiMethod = userApi.queryByAd
