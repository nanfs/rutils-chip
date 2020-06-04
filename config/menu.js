/* eslint-disable no-param-reassign */
const menu = [
  {
    title: '首页',
    icon: 'home',
    path: '/dashboard',
    authority: 'admin,security'
  },
  {
    title: '资源概览',
    path: '/resource',
    icon: 'pie-chart',
    authority: 'admin,security'
  },
  {
    title: '桌面管理',
    icon: 'zhuomianguanli',
    iconComonpent: 'MyIcon',
    path: '/desktop',
    authority: 'admin,security'
  },
  {
    title: '桌面池管理',
    icon: 'template1',
    iconComonpent: 'MyIcon',
    path: '/pool',
    authority: 'admin,security'
  },
  {
    title: '模板管理',
    icon: 'template',
    iconComonpent: 'MyIcon',
    path: '/template',
    authority: 'admin'
  },
  {
    title: '计划任务',
    icon: 'schedule',
    path: '/task',
    authority: 'admin'
  },
  {
    title: '终端管理',
    icon: 'terminal',
    iconComonpent: 'MyIcon',
    path: '/terminal',
    authority: 'admin,security'
  },
  {
    title: '终端任务',
    icon: 'calendar',
    path: '/terminalTask',
    authority: 'admin,security'
  },
  {
    title: '外设控制',
    icon: 'usb',
    path: '/device',
    authority: 'admin,security'
  },
  {
    title: '准入控制',
    icon: 'login',
    path: '/access',
    authority: 'admin,security'
  },
  // {
  //   title: '标签管理',
  //   icon: 'tag',
  //   path: '/label',
  //   authority: 'admin'
  // },
  {
    title: '用户管理',
    icon: 'yonghuguanli',
    iconComonpent: 'MyIcon',
    path: '/user',
    authority: 'admin,security'
  },
  {
    title: '系统日志',
    icon: 'log',
    iconComonpent: 'MyIcon',
    path: '/log',
    authority: 'admin,security,audit',
    children: [
      {
        title: '桌面日志',
        icon: 'log',
        iconComonpent: 'MyIcon',
        authority: 'admin,security,audit',
        path: '/vmlog'
      },
      {
        title: '终端日志',
        icon: 'log',
        iconComonpent: 'MyIcon',
        authority: 'admin,security,audit',
        path: '/tclog'
      }
    ]
  }
]
export default menu
