import React from 'react'

import { Icon, Tooltip, Popover } from 'antd'
import { MyIcon } from '@/components'
import { osType, vmStatus } from './enum'
import classnames from 'classnames'

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
export function renderSatus(statusObj, currentText, isWithText = true) {
  const current = statusObj.find(item => item.value === currentText) || {}
  const { text, icon, color, iconComp } = current
  const cls = classnames(
    color && `table-icon-${color}`,
    iconComp === 'MyIcon' && 'myicon-fix'
  )
  const Component = iconComp === 'MyIcon' ? MyIcon : Icon
  if (isWithText) {
    return (
      <span title={text}>
        <Component type={icon} className={cls} style={{ marginRight: '5px' }} />
        <span>{text}</span>
      </span>
    )
  }
  return <Component type={icon} className={cls} title={text} />
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
  'storage-unattached': '未附加',
  'storage-active': '激活',
  'storage-inactive': '未激活',
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

export const vmStatusRender = status => {
  const current = vmStatus.find(item => +item.status === status) || {}
  const { text, icon } = current
  return (
    <span className="vt-bottom" title={text}>
      <MyIcon
        type={icon}
        title={text}
        style={{
          fontSize: '18px'
        }}
      />
    </span>
  )
}

export const vmOsRender = osId => {
  const current = osType.find(item => +item.id === osId) || {}
  const { icon, text } = current
  return (
    <span className="vt-bottom" title={text}>
      <MyIcon
        type={icon}
        title={text || 'null'}
        component="svg"
        style={{
          fontSize: '18px'
        }}
      />
    </span>
  )
}
export const osTextRender = osId => {
  const current = osType.find(item => +item.id === osId) || {}
  return current?.text
}

// 已分配用户显示
export function assignedUsersRender(value) {
  if (!value) {
    return <Icon type="close" className="table-icon-warn" />
  } else if (value.indexOf(',') !== -1) {
    const strArr = value
      ?.replace(/internal-authz/g, '本地组(internal)')
      .split(',')
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
    const user = <p>{value?.replace(/internal-authz/g, '本地组(internal)')}</p>
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

// 正常、可用图标显示
export function availableStatusRender(text) {
  return (
    <Icon
      title={text}
      type="check-circle"
      style={{
        color: '#17abe3'
      }}
    />
  )
}
// 计划任务-任务类型
export const taskType = type => {
  const typeList = {
    0: '定时开机',
    1: '定时关机',
    2: '定时重启'
  }
  return <span>{typeList[type]}</span>
}

// 升级包类型
export const packageTypeRender = type => {
  const typeList = {
    0: '系统',
    1: '软件'
  }
  return <span>{typeList[type]}</span>
}

// 升级类型
export const upgradeTypeRender = type => {
  const typeList = {
    0: '增量',
    1: '全量'
  }
  return <span>{typeList[type]}</span>
}

// 升级类型
export const priorityLevel = type => {
  const typeList = {
    0: '非强制',
    1: '强制'
  }
  return <span>{typeList[type]}</span>
}
// 终端任务 任务类型显示
export function taskTypeRender(text) {
  const typeList = {
    '0': '锁定',
    '1': '解锁',
    '2': '关机',
    '3': '重启',
    '4': '断网',
    '5': '发送消息',
    '6': '设置外设控制',
    '7': '升级',
    '8': '准入超时',
    '9': '编辑终端'
  }
  return typeList[text]
}
