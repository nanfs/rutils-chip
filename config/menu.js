/* eslint-disable no-param-reassign */
const menu = [
  // {
  //   name: 'dashboard',
  //   title: '首页',
  //   icon: 'enter'
  // },
  {
    name: 'test',
    title: '公共测试',
    icon: 'bianjiebangong'
  },
  {
    name: 'workflow',
    title: '工作流程',
    icon: 'gongzuoliucheng'
  },
  {
    name: 'work',
    title: '任务管理',
    icon: 'tasks'
  },
  {
    name: 'manage',
    title: '人力资源',
    icon: 'users'
  },
  {
    name: 'convenient',
    title: '便捷办公',
    icon: 'bianjiebangong'
  }
]
function formatMenu(_menu, parentPath = '/') {
  return _menu.map(item => {
    const path = `${parentPath}${item.name}`
    item.path = path
    if (item.children) {
      item.children = formatMenu(item.children, `${path}/`)
    }
    return item
  })
}

function getMenuData() {
  return formatMenu(menu)
}

export default getMenuData
