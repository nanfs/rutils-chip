import moment from 'moment'

// 时间格式化
export function dateFormat(val, format = 'YYYY-MM-DD HH:mm:ss') {
  console.log(val)
  if (!val) {
    return val
  }
  return moment(val).format(format)
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
  console.log()
  nodes.sort((a, b) => a[parentId] > b[parentId])
  const nodeArr = [...nodes]
  const tree = {}

  for (let i = nodes.length - 1; i >= 0; i--) {
    const nowPid = nodes[i].parentId
    const nowId = nodes[i].id
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
  console.log(urlParam)
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
        if (res.data.success !== undefined && res.data.success === false) {
          reject()
          break
        }
        resolve(res.data)
        break

      case 404:
        reject()
        break

      default:
        if (
          res.data.data &&
          res.data.data.errorCode &&
          res.data.data.errorCode.indexOf('TOKEN-') === 0
        ) {
          reject()
          break
        }
    }
  })
}
