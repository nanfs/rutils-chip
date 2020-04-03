import desktopsApi from '@/services/desktops'
import React from 'react'
import { Progress, Menu, Popover } from 'antd'
import {
  vmStatusRender,
  osIconRender,
  osTextRender,
  assignedUsersRender
} from '@/utils/tableRender'
import { onlineStringTime } from '@/utils/tool'
import { MyIcon } from '@/components'
import {
  setClusterToSession,
  setDataCenterToSession,
  setHostToSession
} from '@/utils/storage'

// TODO 会有不同步问题 后期优化
setClusterToSession()
setDataCenterToSession()
setHostToSession()
export const columns = [
  {
    title: '操作系统',
    dataIndex: 'os',
    render: text => {
      return (
        <span>
          {osIconRender(text)} {osTextRender(text)}
        </span>
      )
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    filters: [
      { value: [0, 13], text: '关机' },
      { value: [1], text: '开机' },
      { value: [2, 16, 10, 15, 5, 6, 11, 12, 9], text: '运行' },
      { value: [7, 8, 14, -1, 4], text: '异常' }
    ],
    render: text => vmStatusRender(text)
  },
  {
    title: '主机',
    ellipsis: true,
    dataIndex: 'hostName',
    filters: JSON.parse(sessionStorage.getItem('hosts'))
  },
  {
    title: 'IP',
    ellipsis: true,
    dataIndex: 'ip',
    sorter: true
  },
  {
    title: '数据中心',
    ellipsis: true,
    dataIndex: 'datacenterName',
    filters: JSON.parse(sessionStorage.getItem('datacenters'))
  },
  {
    title: '集群',
    ellipsis: true,
    dataIndex: 'clusterName',
    filters: JSON.parse(sessionStorage.getItem('clusters'))
  },
  {
    title: '用户',
    dataIndex: 'assignedUsers',
    width: 60,
    render: text => assignedUsersRender(text)
  },
  {
    title: '控制台',
    dataIndex: 'isConsole',
    width: 100,
    render: (text, record) => {
      const consoleContent = record.consoleUserName ? (
        <Popover content={record.consoleUserName}>
          <MyIcon type="tc-connecting" component="svg" />
          <span>已连接</span>
        </Popover>
      ) : (
        <div>
          <MyIcon type="storage-unattached" component="svg" />
          <span>未连接</span>
        </div>
      )
      return consoleContent
    }
  },
  {
    title: '已运行',
    key: 'onlineTime',
    dataIndex: 'onlineTime',
    sorter: true,
    render: text => onlineStringTime(text)
  },
  {
    title: 'CPU',
    dataIndex: 'cpuUsageRate',
    render: text => {
      return (
        <Progress
          strokeWidth={16}
          percent={+text || 0}
          status={+text < 100 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  },
  {
    title: '内存',
    dataIndex: 'memoryUsageRate',
    render: text => {
      return (
        <Progress
          strokeWidth={16}
          percent={+text || 0}
          status={+text < 100 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  },
  {
    title: '网络',
    dataIndex: 'networkUsageRate',
    render: text => {
      return (
        <Progress
          strokeWidth={16}
          percent={+text || 0}
          status={+text < 100 ? 'active' : 'exception'}
        ></Progress>
      )
    }
  }
]

export const defaultColumnsFilters = columns.map(item => ({
  value: item.dataIndex,
  text: item.title
}))
export const defaultColumnsValue = columns.map(item => item.dataIndex)
export const apiMethod = desktopsApi.list

export const searchOptions = [
  { label: '名称', value: 'name' },
  { label: '主机名', value: 'hostName' },
  { label: '数据中心', value: 'datacenterName' },
  { label: '集群', value: 'clusterName' }
]
/**
 *
 *
 * @export
 * @param {*} {
 *   disabledButton,
 *   sendOrderFn,
 *   deleteFn,
 *   addTempFn,
 * isDuplicated  是否为副本  在桌面池 和模板里面为ture
 * }
 * @returns
 * 表格工具条 更多按钮
 */
export function getMoreButton({
  disabledButton,
  sendOrderFn,
  deleteFn,
  addTempFn,
  setUserFn,
  openConsoleFn,
  isInnerMore = false,
  isDuplicated = false
}) {
  return (
    <Menu>
      <Menu.Item
        key="0"
        hidden={!isInnerMore || isDuplicated}
        onClick={setUserFn}
        disabled={disabledButton?.disabledSetUser}
      >
        分配用户
      </Menu.Item>
      <Menu.Item
        key="1"
        hidden={!isInnerMore || isDuplicated}
        onClick={openConsoleFn}
        disabled={disabledButton?.disabledOpenConsole}
      >
        打开控制台
      </Menu.Item>
      <Menu.Item
        key="2"
        disabled={disabledButton?.disabledUp}
        hidden={isDuplicated}
        onClick={() => sendOrderFn('start')}
      >
        开机
      </Menu.Item>
      <Menu.Item
        key="3"
        hidden={isDuplicated && !isInnerMore}
        disabled={disabledButton?.disabledDown}
        onClick={() => sendOrderFn('shutdown')}
      >
        关机
      </Menu.Item>
      <Menu.Item
        key="4"
        disabled={disabledButton?.disabledPowerOff}
        onClick={() => sendOrderFn('poweroff')}
      >
        断电
      </Menu.Item>
      <Menu.Item
        key="5"
        disabled={disabledButton?.disabledRestart}
        onClick={() => sendOrderFn('restart')}
      >
        重启
      </Menu.Item>
      <Menu.Item
        key="6"
        hidden={!isInnerMore || isDuplicated}
        disabled={disabledButton?.disabledAddTem}
        onClick={addTempFn}
      >
        创建模板
      </Menu.Item>
      <Menu.Item
        key="10"
        onClick={deleteFn}
        disabled={disabledButton?.disabledDelete}
      >
        删除
      </Menu.Item>
    </Menu>
  )
}

/**
 *
 * 通过vm判断 禁用操作 通用表格工具和表格内更多操作
 * @param {*} vmObj
 * @returns
 * 未关机和挂起  不能开机 和删除
 * 未开机 不能打开控制台
 * 关机 不能关机 重启和断电
 * 正在重启不能重启
 * 如果有分配用户 管理员不能打开控制台
 */
export function vmDisableAction(vmObj) {
  let disabledButton = {}
  if (vmObj.status !== 0 && vmObj.status !== 13) {
    disabledButton = {
      ...disabledButton,
      disabledDelete: true,
      disabledUp: true
    }
  }
  if (vmObj.status !== 1) {
    disabledButton = {
      ...disabledButton,
      disabledOpenConsole: true
    }
  }
  if (vmObj.status === 0) {
    disabledButton = {
      ...disabledButton,
      disabledDown: true,
      disabledRestart: true,
      disabledPowerOff: true
    }
  }
  if (vmObj.status === 10) {
    disabledButton = {
      ...disabledButton,
      disabledRestart: true
    }
  }
  if (vmObj.assignedUsers) {
    disabledButton = {
      ...disabledButton,
      disabledDelete: true,
      disabledOpenConsole: true
    }
  }
  return disabledButton
}
/**
 *
 *
 * @export
 * @param {*} selection
 * @param {*} selectData
 * @returns disabledButton
 * 无选择 禁用更多按钮
 * 只选择一个 可创建模板
 */
export function vmDisabledButton(selection, selectData) {
  let disabledButton = {}
  if (selection.length === 0) {
    disabledButton = {
      ...disabledButton,
      disabledMore: true,
      disabledAddTem: true,
      disabledDelete: true,
      disabledSetUser: true,
      disabledUp: true,
      disabledDown: true,
      disabledPowerOff: true,
      disabledRestart: true,
      disabledOpenConsole: true
    }
    return disabledButton
  }
  if (selection.length !== 1) {
    disabledButton = {
      ...disabledButton,
      disabledAddTem: true
    }
  }
  selectData.forEach(item => {
    const disabledAction = vmDisableAction(item)
    console.log('disabledAction', disabledAction)
    disabledButton = {
      ...disabledButton,
      ...disabledAction
    }
  })
  return disabledButton
}

/**
 *
 *
 * @export
 * @param {*} filter
 * @param {*} sorter
 * 排序转换 只有一个排序条件 安照后端排序转化 asc  desc
 * 过滤状态 将状态转为一维数组
 * 过滤表格列 如果有过滤表格列 返回最新表格列
 */
export function vmFilterSorterTransform(filter, sorter) {
  const { clusterName, hostName, datacenterName } = filter
  let searchs = {}
  const statusList = []
  let columnsList = [...columns]
  const orderArr = {
    ascend: 'asc',
    descend: 'desc'
  }
  if (sorter) {
    const { order, field } = sorter
    searchs.sortKey = field || undefined
    searchs.sortValue = (order && orderArr[order]) || undefined
  }
  filter.status &&
    filter.status.forEach(function(v) {
      statusList.push(...v)
    })
  searchs = {
    ...searchs,
    status: statusList,
    clusters: clusterName,
    hosts: hostName,
    datacenters: datacenterName
  }
  if (filter.action) {
    columnsList = columnsList.filter(item =>
      filter.action.includes(item.dataIndex)
    )
  }
  return { searchs, columnsList }
}
