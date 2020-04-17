import dayjs from 'dayjs'

// 时间格式化
export function dateFormat(val, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!val) {
    return val
  }
  return dayjs(val).format(format)
}
// // 对象转数组
export function obj2KeyValueArray(obj) {
  const array = []
  if (!obj) return array
  Object.keys(obj).forEach(o => {
    array.push({ key: o, value: obj[o] })
  })
  return array
}
// // 对象转数组
export function dataToOptions(objArr) {
  const options = []
  if (Array.isArray(objArr)) {
    objArr &&
      objArr.forEach(item => {
        const disable = Object.prototype.hasOwnProperty.call(item, 'disable')
          ? { disable: item.disable }
          : null
        options.push({
          label: item.label || item.name,
          value: item.id || item.value,
          ...disable
        })
      })
  }
  return options
}
// arrToTree
// arr 格式[{ id: 'department1', title: '用户组', parentId: null },
// {
//   id: 'department2',
//   title: '成都研发中心',
//   parentId: 'department1'
// }],
export function nodes2Tree(nodes, parentId = 'parentId') {
  if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes(parentId)) {
    console.warn('数据格式不符合')
    return []
  }
  nodes.sort((a, b) => a[parentId] - b[parentId])
  const nodeArr = [...nodes]
  const tree = {}

  for (let i = nodes.length - 1; i >= 0; i--) {
    const nowPid = nodes[i].parentId
      ? nodes[i].parentId.toString()
      : nodes[i].parentId
    const nowId = nodes[i].id.toString()
    // 建立当前节点的父节点的children 数组
    if (tree[nowPid]) {
      tree[nowPid].push(nodes[i])
    } else {
      tree[nowPid] = []
      tree[nowPid].push(nodes[i])
    }
    // 将children 放入合适的位置
    if (tree[nowId]) {
      nodeArr[i].children = tree[nowId]
      delete tree[nowId]
    }
  }
  return tree[Object.keys(tree)[0]]
}
// 判断对象是否有value为true，用于控制抽屉显示
export function objhasTrue(obj) {
  if (!obj || !Object.keys(obj).length) {
    return false
  }
  return Object.keys(obj).some(item => obj[item] === true)
}

// 获取搜索中的键值对
export function searchObj(string) {
  if (!string || !string.indexOf('?')) {
    return {}
  }
  const validUrl = string.match(/\?([^#]+)/)[1]
  const urlParamArr = validUrl.split('&')
  const urlParam = {}
  for (let i = 0; i < urlParamArr.length; i++) {
    const subArr = urlParamArr[i].split('=')
    const key = decodeURIComponent(subArr[0])
    const value = decodeURIComponent(subArr[1])
    urlParam[key] = value
  }
  return urlParam
}

export function getFileStream(fileUrl, fileName) {
  fetch(fileUrl, {
    method: 'POST',
    // body: window.JSON.stringify(params),
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      const filename = fileName
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    })
}
export function formatTimeToString(time, formatString = 'YYYY/MM/DD') {
  if (typeof time === 'string') {
    return time
  }
  return time.format(formatString)
}
export const genderOptions = [
  { label: '男', value: 0 },
  { label: '女', value: 1 }
]
export const statusOptions = [
  { label: '在岗', value: 0 },
  { label: '离职', value: 1 },
  { label: '已退休', value: 2 }
]
export const taskPpriorityOptions = [
  { label: '普通', value: 3 },
  { label: '重要', value: 2 },
  { label: '紧急', value: 1 }
]

export const taskStatusOptions = [
  { label: '进行中', value: 1 },
  { label: '未开始', value: 2 },
  { label: '已完成', value: 3 },
  { label: '暂停', value: 4 }
]

export function wrapResponse(res) {
  return new Promise((resolve, reject) => {
    switch (res.code) {
      case 200:
        if (res.success !== undefined && res.success === false) {
          reject(res)
          break
        }
        resolve(res.data)
        break

      case 201:
        if (res.success !== undefined && res.success === false) {
          reject(res)
          break
        }
        resolve(res.data)
        break

      case 404:
        reject(res)
        break

      default:
        if (
          res.data?.data &&
          res.data.data.errorCode &&
          res.data.data.errorCode.indexOf('TOKEN-') === 0
        ) {
          reject(res)
          break
        }
    }
  })
}

export function scrollToAnchor(id) {
  document.getElementById(id).scrollIntoView()
}

// 把字符串中的汉字转换成Unicode
export function ch2Unicdoe(str) {
  if (!str) {
    return
  }
  let unicode = ''
  for (let i = 0; i < str.length; i++) {
    const temp = str.charAt(i)
    if (/[\u4e00-\u9fa5]/.test(temp)) {
      unicode += `\\u${temp.charCodeAt(0).toString(16)}`
    } else {
      unicode += temp
    }
  }
  return unicode
}

/**
 * @description
 * @author lishuai
 * @date 2020-04-08
 * @param flow
 * @param name
 */
export function downloadVV(flow, name) {
  const blob = new Blob([flow], {
    type: 'application/x-virt-viewer;charset=UTF-8'
  })
  const objUrl = URL.createObjectURL(blob)
  const aLink = document.createElement('a')
  aLink.download = `${name}.vv`
  document.body.appendChild(aLink)
  aLink.style.display = 'none'
  aLink.href = objUrl
  aLink.click()
  document.body.removeChild(aLink)
  window.URL.revokeObjectURL(objUrl)
  aLink.setAttribute('download', name)
}

// 防抖动函数
export function debounce(fn, wait) {
  let timer = null
  return function() {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, wait)
  }
}

export function onlineStringTime(value) {
  // return second
  // 按照秒计算
  if (!value) {
    return ''
  }
  const days = Math.floor(value / 86400)
  const hours = Math.floor(value / 3600) - days * 24
  const minutes = Math.floor(value / 60) - days * 1440 - hours * 60
  const second = Math.ceil(value % 60)
  let timeString = ''
  if (value === 0 || value === '0') {
    return '0秒'
  }
  if (days) {
    timeString += `${days}天`
  }
  if (hours) {
    timeString += `${hours}小时`
  }
  if (minutes) {
    timeString += `${minutes}分`
  }
  if (second !== 0) {
    timeString += `${second}秒`
  }
  return timeString
}

export function findArrObj(arr, key, target) {
  const current = arr?.find(item => item[key] === target) || {}
  return current
}
