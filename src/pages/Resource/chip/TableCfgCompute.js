import React from 'react'
import resourceApi from '@/services/resource'
import { Progress } from 'antd'
import MyIcon from '@/components/MyIcon'
import styles from '../index.m.scss'

const statusRender = status => {
  const typeList = {
    '0': 'poweroff',
    '1': 'downing',
    '2': 'uping',
    '3': 'zaixian',
    '4': 'success',
    '5': 'link',
    '6': 'unlink',
    '7': 'turn-off',
    '8': 'poweroff',
    '9': 'downing',
    '10': 'uping',
    '11': 'zaixian',
    '12': 'success',
    '13': 'link',
    '14': 'unlink',
    '15': 'turn-off'
  }
  return (
    <MyIcon
      type={typeList[status]}
      component="svg"
      style={{ fontSize: '18px' }}
    />
  )
}

export const columnsCompute = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 144,
    filters: [
      {
        text: '未指派的',
        value: '0'
      },
      {
        text: '关机',
        value: '1'
      },
      {
        text: '维护',
        value: '2'
      },
      {
        text: '开机',
        value: '3'
      },
      {
        text: '没有响应',
        value: '4'
      },
      {
        text: '错误',
        value: '5'
      },
      {
        text: '正在安装',
        value: '6'
      },
      {
        text: '安装失败',
        value: '7'
      },
      {
        text: '重启',
        value: '8'
      },
      {
        text: '准备维护',
        value: '9'
      },
      {
        text: '不可操作',
        value: '10'
      },
      {
        text: '待批准',
        value: '11'
      },
      {
        text: '正在初始化',
        value: '12'
      },
      {
        text: '正在连接',
        value: '13'
      },
      {
        text: '安装系统过程中',
        value: '14'
      },
      {
        text: '释放资源过程中',
        value: '15'
      }
    ],
    onFilter: (value, record) => record.status == value,
    render: text => statusRender(text)
  },
  {
    title: '主机名称',
    dataIndex: 'name'
  },
  {
    title: '主机IP',
    dataIndex: 'ip'
  },
  {
    title: 'CPU',
    dataIndex: 'usageCpuPercent',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={text}
        ></Progress>
      )
    }
  },
  {
    title: '内存',
    dataIndex: 'usageMemPercent',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={text}
        ></Progress>
      )
    }
  },
  {
    title: '网络',
    dataIndex: 'usageNetworkPercent',
    width: '15%',
    render: text => {
      return (
        <Progress
          strokeColor="#40d00f"
          strokeWidth={16}
          percent={text}
        ></Progress>
      )
    }
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '桌面总数',
    dataIndex: 'numOfDesktop',
    render: text => {
      return <div className={styles.vmBg}>{text}</div>
    }
  }
]
export const apiMethodCompute = resourceApi.listCompute
