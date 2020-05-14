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
} from '@/utils/preFilter'
import { checkAuth } from '@/utils/checkPermissions'

// TODO 会有不同步问题 后期优化
setClusterToSession()
setDataCenterToSession()
setHostToSession()

/**
 * @description
 * @author lishuai
 * @date 2020-04-17
 * @export
 * @param {boolean} [isPoolVmlist=false]
 * @returns
 */
export function getColumns(isPoolVmlist = false) {
  return [
    {
      title: () => <span title="桌面名称">桌面名称</span>,
      dataIndex: 'name',
      ellipsis: true,
      render: (text, record) => {
        return <span>{record.name}</span>
      },
      sorter: isPoolVmlist ? undefined : true
    },
    {
      title: () => <span title="状态">状态</span>,
      dataIndex: 'status',
      width: '8%',
      ellipsis: true,
      filters: [
        { value: [0, 13], text: '已关机' },
        { value: [1], text: '已开机' },
        { value: [2, 16, 10, 15, 5, 6, 11, 12, 9], text: '运行' },
        { value: [7, 8, 14, -1, 4], text: '异常' }
      ],
      render: text => vmStatusRender(text)
    },
    {
      title: () => <span title="操作系统">操作系统</span>,
      dataIndex: 'os',
      ellipsis: true,
      render: text => {
        return (
          <span title={osTextRender(text)}>
            {osIconRender(text)} {osTextRender(text)}
          </span>
        )
      }
    },
    {
      title: () => <span title="主机">主机</span>,
      ellipsis: true,
      dataIndex: 'hostName',
      filters: isPoolVmlist
        ? undefined
        : JSON.parse(sessionStorage.getItem('hosts'))
    },
    {
      title: () => <span title="IP">IP</span>,
      ellipsis: true,
      dataIndex: 'ip',
      sorter: isPoolVmlist ? undefined : true
    },
    {
      title: () => <span title="数据中心">数据中心</span>,
      ellipsis: true,
      dataIndex: 'datacenterName',
      filters: isPoolVmlist
        ? undefined
        : JSON.parse(sessionStorage.getItem('datacenters'))
    },
    {
      title: () => <span title="集群">集群</span>,
      ellipsis: true,
      dataIndex: 'clusterName',
      filters: isPoolVmlist
        ? undefined
        : JSON.parse(sessionStorage.getItem('clusters'))
    },
    {
      title: () => <span title="用户">用户</span>,
      width: 70,
      dataIndex: 'assignedUsers',
      render: text => assignedUsersRender(text)
    },
    {
      title: () => <span title="控制台">控制台</span>,
      width: 100,
      dataIndex: 'isConsole',
      ellipsis: true,
      filters: [
        { value: 'true', text: '已连接' },
        { value: 'false', text: '未连接' }
      ],
      render: (text, record) => {
        const consoleContent = record.clientIp ? (
          <Popover content={record.clientIp}>
            <MyIcon type="tc-connecting" component="svg" />
            <span title="已连接">已连接</span>
          </Popover>
        ) : (
          <div className="ellipsis-noWhiteSpace">
            <MyIcon type="storage-unattached" component="svg" />
            <span title="未连接">未连接</span>
          </div>
        )
        return consoleContent
      }
    },
    {
      title: () => <span title="已运行">已运行</span>,
      key: 'onlineTime',
      ellipsis: true,
      dataIndex: 'onlineTime',
      sorter: isPoolVmlist ? undefined : true,
      render: text => onlineStringTime(text)
    },
    {
      title: () => <span title="CPU">CPU</span>,
      dataIndex: 'cpuUsageRate',
      render: text => {
        return (
          <Progress
            strokeWidth={16}
            percent={+text || 0}
            format={() => `${text || 0}%`}
            status={+text < 80 ? 'active' : 'exception'}
          ></Progress>
        )
      }
    },
    {
      title: () => <span title="内存">内存</span>,
      dataIndex: 'memoryUsageRate',
      render: text => {
        return (
          <Progress
            strokeWidth={16}
            percent={+text || 0}
            format={() => `${text || 0}%`}
            status={+text < 80 ? 'active' : 'exception'}
          ></Progress>
        )
      }
    },
    {
      title: () => <span title="网络">网络</span>,
      dataIndex: 'networkUsageRate',
      render: text => {
        return (
          <Progress
            strokeWidth={16}
            percent={+text || 0}
            format={() => `${text || 0}%`}
            status={+text < 80 ? 'active' : 'exception'}
          ></Progress>
        )
      }
    }
  ]
}
// 去掉桌面名称
export const defaultColumnsFilters = getColumns()
  .map(item => ({
    value: item.dataIndex,
    text: item.title()
  }))
  .slice(1)
export const defaultColumnsValue = getColumns()
  .map(item => item.dataIndex)
  .slice(1)
export const apiMethod = desktopsApi.list

export const searchOptions = [
  { label: '名称', value: 'name' },
  { label: '主机', value: 'hostName' },
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
  attachIsoFn,
  removePermissionFn,
  isInnerMore = false,
  isDuplicated = false,
  isPoolVmlist = false
}) {
  return (
    <Menu>
      <Menu.Item
        key="0"
        hidden={!isInnerMore || isDuplicated || !checkAuth('security')}
        onClick={setUserFn}
        disabled={disabledButton?.disabledSetUser}
      >
        分配用户
      </Menu.Item>
      <Menu.Item
        key="1"
        hidden={!isInnerMore || isDuplicated || !checkAuth('admin')}
        onClick={openConsoleFn}
        disabled={disabledButton?.disabledOpenConsole}
      >
        打开控制台
      </Menu.Item>
      <Menu.Item
        key="7"
        hidden={isDuplicated || !isInnerMore || !checkAuth('admin')}
        onClick={attachIsoFn}
        disabled={disabledButton?.disabledAttachIso}
      >
        附加CD
      </Menu.Item>
      <Menu.Item
        key="2"
        disabled={disabledButton?.disabledUp}
        hidden={isDuplicated || !checkAuth('admin')}
        onClick={() => sendOrderFn('start')}
      >
        开机
      </Menu.Item>
      <Menu.Item
        key="3"
        hidden={(isDuplicated && !isInnerMore) || !checkAuth('admin')}
        disabled={disabledButton?.disabledDown}
        onClick={() => sendOrderFn('shutdown')}
      >
        关机
      </Menu.Item>
      <Menu.Item
        key="4"
        hidden={!checkAuth('admin')}
        disabled={disabledButton?.disabledPowerOff}
        onClick={() => sendOrderFn('poweroff')}
      >
        断电
      </Menu.Item>
      <Menu.Item
        key="5"
        hidden={!checkAuth('admin')}
        disabled={disabledButton?.disabledRestart}
        onClick={() => sendOrderFn('restart')}
      >
        重启
      </Menu.Item>
      <Menu.Item
        key="6"
        hidden={!isInnerMore || isDuplicated || !checkAuth('admin')}
        disabled={disabledButton?.disabledAddTem}
        onClick={addTempFn}
      >
        创建模板
      </Menu.Item>
      <Menu.Item
        key="7"
        hidden={!isPoolVmlist || !checkAuth('security')}
        disabled={disabledButton?.disabledRemovePermission}
        onClick={removePermissionFn}
      >
        回收权限
      </Menu.Item>
      <Menu.Item
        key="10"
        hidden={!checkAuth('admin')}
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
 * 未关机和挂起  不能开机 和删除 和 创建模板
 * 未开机 不能打开控制台 和 附加CD
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
      disabledUp: true,
      disabledAddTem: true
    }
  }
  // 开机 或者正在开机 可以打开控制台
  if (vmObj.status !== 1 && vmObj.status !== 2) {
    disabledButton = {
      ...disabledButton,
      disabledOpenConsole: true
    }
  }
  if (vmObj.status !== 1) {
    disabledButton = {
      ...disabledButton,
      disabledAttachIso: true
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
  // 不禁用感觉要方便点
  if (!vmObj.assignedUsers) {
    disabledButton = {
      ...disabledButton,
      disabledRemovePermission: true
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
      disabledOpenConsole: true,
      disabledRemovePermission: true
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
 * 是否已连接 处理 只发送单选一项 选择两项前端显示 但不发送请求
 */
export function vmFilterSorterTransform(filter, sorter, isPoolVmlist = false) {
  const { clusterName, hostName, datacenterName, isConsole } = filter
  let searchs = {}
  const statusList = []
  let columnsList = [...getColumns(isPoolVmlist)]
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
    isConsole: isConsole?.length === 1 ? isConsole[0] : undefined,
    datacenters: datacenterName
  }
  if (filter.action) {
    columnsList = columnsList.filter(item =>
      filter.action.includes(item.dataIndex)
    )
  }
  return { searchs, columnsList: [getColumns(isPoolVmlist)[0], ...columnsList] }
}
