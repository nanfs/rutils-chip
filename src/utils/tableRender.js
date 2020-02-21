import React from 'react'
import { Icon } from 'antd'
import MyIcon from '@/components/MyIcon'

export const severityOptions = [
  {
    text: '一般',
    value: 0,
    icon: 'info-circle',
    color: 'info'
  },
  {
    text: '警告',
    value: 1,
    icon: 'warning',
    color: 'warn'
  },
  {
    text: '错误',
    value: 2,
    icon: 'alert',
    color: 'alert'
  },
  {
    text: '告警',
    value: 10,
    icon: 'bulb',
    color: 'msg'
  }
]
export function renderServerityOptions(recordText) {
  const current = severityOptions.find(item => item.value === recordText) || {}
  const { text, icon, color } = current
  return <Icon type={icon} className={`table-icon-${color}`} title={text} />
}
export const hostStatusRender = status => {
  const statusList = {
    '0': 'host-unassigned',
    '1': 'host-down',
    '2': 'host-maintenance',
    '3': 'host-up',
    '4': 'host-nonresponsive',
    '5': 'host-error',
    '6': 'host-installing',
    '7': 'host-installfailed',
    '8': 'host-reboot',
    '9': 'host-preparingformaintenance',
    '10': 'host-nonoperational',
    '11': 'host-pendingapproval',
    '12': 'host-initializing',
    '13': 'host-connecting',
    '14': 'host-installingos',
    '15': 'host-kdumping'
  }
  return (
    <MyIcon
      type={statusList[status]}
      component="svg"
      style={{ fontSize: '18px' }}
    />
  )
}
export const storageStatusRender = status => {
  const statusList = {
    '0': 'storage--unknown-copy',
    '1': 'storage-uninitialized',
    '2': 'storage-unattached',
    '3': 'storage-active',
    '4': 'storage-inactive',
    '5': 'storage-imagelocked',
    '6': 'storage-maintenance',
    '7': 'storage-preparingformaintenance',
    '8': 'storage-detaching',
    '9': 'storage-activing'
  }
  return (
    <MyIcon
      type={statusList[status]}
      component="svg"
      style={{ fontSize: '18px' }}
    />
  )
}
export const storageTypeRender = type => {
  const typeList = {
    '0': 'UNKNOWN',
    '1': 'NFS',
    '2': 'FCP',
    '3': 'ISCSI',
    '4': 'LOCALFS',
    '6': 'POSIXFS',
    '7': 'GLUSTERFS',
    '8': 'GLANCE',
    '9': 'CINDER',
    '10': 'MANAGED_BLOCK_STORAGE'
  }
  return <span>{typeList[type]}</span>
}
export const vmStatusRender = status => {
  const statusList = {
    '-1': 'vm-unassigned',
    '0': 'vm-Down',
    '1': 'vm-up',
    '2': 'vm-poweringup',
    '4': 'vm-paused',
    '5': 'vm-migratingfrom',
    '6': 'vm-migratingTo',
    '7': 'vm-unknown',
    '8': 'vm-nonresponsive',
    '9': 'vm-waitforlaunch',
    '10': 'vm-rebootinprogress',
    '11': 'vm-savingstate',
    '12': 'vm-restoringstate',
    '13': 'vm-suspended',
    '14': 'vm-ImageIllegal',
    '15': 'vm-imagelocked',
    '16': 'vm-poweringdown'
  }
  return (
    <MyIcon
      type={statusList[status]}
      component="svg"
      style={{ fontSize: '18px' }}
    />
  )
}
export const osStatusRender = status => {
  const statusList = {
    '9': 'os-redhat',
    '15': 'os-redhat',
    '8': 'os-redhat',
    '14': 'os-redhat',
    '7': 'os-redhat',
    '13': 'os-redhat',
    '18': 'os-redhat',
    '19': 'os-redhat',
    '24': 'os-redhat',
    '1003': 'os-redhat',
    '1006': 'os-redhat',
    '1': 'os-windows',
    '3': 'os-windows',
    '4': 'os-windows',
    '10': 'os-windows',
    '11': 'os-windows',
    '12': 'os-windows',
    '16': 'os-windows',
    '17': 'os-windows',
    '20': 'os-windows',
    '21': 'os-windows',
    '23': 'os-windows',
    '51': 'os-qilin'
  }
  return (
    <MyIcon
      type={statusList[status]}
      component="svg"
      style={{ fontSize: '18px' }}
    />
  )
}
