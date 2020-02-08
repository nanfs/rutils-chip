/* eslint-disable no-param-reassign */
const menu = [
  {
    title: '首页',
    icon: 'user',
    path: '/dashboard',
    authority: 'admin,security'
  },
  {
    title: '资源概览',
    path: '/resource',
    icon: 'user',
    authority: 'admin,security'
  },
  {
    title: '桌面管理',
    icon: 'user',
    path: '/desktop',
    authority: 'admin,security'
  },
  {
    title: '桌面池管理',
    icon: 'user',
    path: '/pool',
    authority: 'admin,security'
  },
  {
    title: '模板管理',
    icon: 'user',
    path: '/template',
    authority: 'admin,security'
  },
  {
    title: '终端管理',
    icon: 'user',
    path: '/terminal',
    authority: 'admin,security'
  },
  {
    title: '外设管理',
    icon: 'user',
    path: '/device',
    authority: 'admin,security'
  },
  {
    title: '准入控制',
    icon: 'user',
    path: '/access',
    authority: 'admin,security'
  },
  {
    title: '系统日志',
    icon: 'user',
    path: '/log',
    authority: 'admin,security',
    children: [
      {
        title: '桌面日志',
        icon: 'user',
        path: '/vmlog',
        authority: 'admin,security'
      },
      {
        title: '终端日志',
        icon: 'user',
        path: '/tclog',
        authority: 'admin,security'
      }
    ]
  }
]
export default menu
