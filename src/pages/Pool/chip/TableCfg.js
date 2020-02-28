import poolsApi from '@/services/pools'
import React from 'react'
import { Tag } from 'antd'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '管理类型',
    dataIndex: 'manageType',
    // filters: [
    //   {
    //     text: '自动',
    //     value: 0
    //   },
    //   {
    //     text: '手动',
    //     value: 1
    //   }
    // ],
    render: text => (text === 0 ? '自动' : '手动')
  },
  {
    title: '模板',
    dataIndex: 'templateName'
  },
  {
    title: '正在运行',
    dataIndex: 'runDesktopNum',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: '预启动',
    dataIndex: 'prestartNum',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: '桌面总数',
    dataIndex: 'desktopNum',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
]
export const apiMethod = poolsApi.list
