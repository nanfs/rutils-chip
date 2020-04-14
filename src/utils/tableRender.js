import React from 'react'

import { Icon, Tooltip, Popover } from 'antd'
import { MyIcon } from '@/components'

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
    text: '告警',
    value: 10,
    icon: 'alert',
    color: 'msg'
  },
  {
    text: '错误',
    value: 2,
    icon: 'close',
    color: 'alert'
  }
]
export function renderSatus(statusObj, currentText, isWithText = false) {
  const current = statusObj.find(item => item.value === currentText) || {}
  const { text, icon, color } = current
  const cls = color && `table-icon-${color}`
  if (isWithText) {
    return <Icon type={icon} className={cls} title={text} />
  }
  return <Icon type={icon} className={cls} title={text} />
}
export function renderServerityOptions(recordText) {
  const current = severityOptions.find(item => item.value === recordText) || {}
  const { text, icon, color } = current

  return (
    <Tooltip title={text}>
      <Icon type={icon} className={`table-icon-${color}`} />
    </Tooltip>
  )
}
export const hostStatusText = {
  'host-unassigned': '未指派的',
  'host-down': '关机',
  'host-maintenance': '维护',
  'host-up': '开机',
  'host-nonresponsive': '没有响应',
  'host-error': '错误',
  'host-installing': '正在安装',
  'host-installfailed': '安装失败',
  'host-reboot': '重启',
  'host-preparingformaintenance': '准备维护',
  'host-nonoperational': '不可操作',
  'host-pendingapproval': '待批准',
  'host-initializing': '正在初始化',
  'host-connecting': '正在连接',
  'host-installingos': '安装系统过程中',
  'host-kdumping': '释放资源过程中'
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
      title={hostStatusText[statusList[status]] || 'null'}
      style={{ fontSize: '18px' }}
    />
  )
}
export const storageStatusText = {
  'storage--unknown-copy': '未知',
  'storage-uninitialized': '未初始化',
  'storage-unattached': '未连接',
  'storage-active': '激活',
  'storage-inactive': '正在激活',
  'storage-imagelocked': '锁定',
  'storage-maintenance': '维护',
  'storage-preparingformaintenance': '准备维护',
  'storage-detaching': '分离过程中',
  'storage-activing': '激活过程中'
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
      title={storageStatusText[statusList[status]] || 'null'}
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
export const vmStatusText = {
  'vm-unassigned': '未指派的',
  'vm-down': '关机',
  'vm-up': '开机',
  'vm-poweringup': '正在开机',
  'vm-paused': '暂停',
  'vm-migratingfrom': '准备迁移',
  'vm-migratingTo': '迁移中',
  'vm-unknown': '未知',
  'vm-nonresponsive': '没有响应',
  'vm-waitforlaunch': '等待',
  'vm-rebootinprogress': '重启过程中',
  'vm-savingstate': '保存状态',
  'vm-restoringstate': '恢复状态',
  'vm-suspended': '挂起',
  'vm-ImageIllegal': '镜像损坏',
  'vm-imagelocked': '镜像锁定',
  'vm-poweringdown': '正在关机'
}
export const vmStatusRender = status => {
  const statusList = {
    '-1': 'vm-unassigned',
    '0': 'vm-down',
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
      title={vmStatusText[statusList[status]] || 'null'}
      component="svg"
      style={{ fontSize: '18px' }}
    />
  )
}
const osList = {
  '0': 'os-other', // other-os
  '5': 'os-linux',
  '7': 'os-redhat',
  '8': 'os-redhat',
  '9': 'os-redhat',
  '13': 'os-redhat',
  '14': 'os-redhat',
  '15': 'os-redhat',
  '18': 'os-redhat',
  '19': 'os-redhat',
  '24': 'os-redhat',
  '28': 'os-redhat',
  '30': 'os-redhat',
  '33': 'os-linux',
  '51': 'os-qilin',
  '1002': 'os-linux',
  '1003': 'os-redhat',
  '1004': 'os-linux',
  '1005': 'os-ubuntu',
  '1006': 'os-redhat',
  '1007': 'os-redhat',
  '1300': 'os-linux',
  '2002': 'os-linux',
  '2004': 'os-linux',
  '2005': 'os-linux',
  '1500': 'os-linux',
  '1501': 'os-linux',
  '1252': 'os-ubuntu',
  '1253': 'os-ubuntu',
  '1254': 'os-ubuntu',
  '1255': 'os-ubuntu',
  '1256': 'os-ubuntu'
}
export const osIconRender = os => {
  return (
    <MyIcon
      type={osList[os] || 'os-windows'}
      component="svg"
      style={{ fontSize: '18px' }}
    />
  )
}
export const osTextRender = os => {
  const osType = osList[os] || 'os-windows'
  const typeList = {
    'os-other': 'OTHER OS',
    'os-redhat': '红帽',
    'os-windows': 'Win',
    'os-qilin': '麒麟',
    'os-ubuntu': '乌班图',
    'os-linux': 'linux'
  }
  return typeList[osType]
}

// 已分配用户显示
export function assignedUsersRender(value) {
  if (!value) {
    return <Icon type="close" className="table-icon-warn" />
  } else if (value.indexOf(',') !== -1) {
    const strArr = value?.replace(/internal-authz/g, '本地组').split(',')
    const info = strArr.map((item, index) => {
      return <p key={index}>{item}</p>
    })
    return (
      <Popover content={info}>
        <Icon
          type="team"
          className="table-icon-success"
          style={{ cursor: 'pointer' }}
        />
      </Popover>
    )
  } else {
    const user = <p>{value?.replace(/internal-authz/g, '本地组')}</p>
    return (
      <Popover content={user}>
        <Icon
          type="user"
          className="table-icon-success"
          style={{ cursor: 'pointer' }}
        />
      </Popover>
    )
  }
}
