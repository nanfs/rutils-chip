import React from 'react'
import templateApi from '@/services/template'
import { Icon } from 'antd'
import styles from '../index.m.scss'
import { style } from 'dom-helpers'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '模板名称',
    dataIndex: 'name'
  },
  {
    title: '已使用桌面',
    dataIndex: 'vmUsed',
    render: text => {
      return <div className={styles.vmBg}>{text}</div>
    }
  },
  {
    title: '父模板',
    dataIndex: 'parentName'
  },
  {
    title: '数据中心/集群',
    dataIndex: 'vm',
    render: (text, record) => {
      return `${record.datacenterName}/${record.clusterName}`
    }
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: text => {
      if (text == '0') {
        return (
          <span>
            <Icon type="lock" className={styles.lock} /> 锁定
          </span>
        )
      } else {
        return (
          <span className={styles['can-use']}>
            <Icon type="check-circle" /> 可用
          </span>
        )
      }
    }
  }
]
export const apiMethod = templateApi.list
