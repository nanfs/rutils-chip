/* eslint-disable no-param-reassign */
const menu = [
  {
    title: '首页',
    icon: 'home',
    path: '/dashboard',
    authority: 'admin'
  },
  {
    title: '资源概览',
    path: '/resource',
    icon: 'pie-chart',
    authority: 'admin'
  },
  {
    title: '桌面管理',
    icon: 'zhuomianguanli',
    iconComonpent: 'MyIcon',
    path: '/desktop',
    authority: 'admin'
  },
  {
    title: '桌面池管理',
    icon: 'template1',
    iconComonpent: 'MyIcon',
    path: '/pool',
    authority: 'admin'
  },
  {
    title: '模板管理',
    icon: 'template',
    iconComonpent: 'MyIcon',
    path: '/template',
    authority: 'admin'
  },
  {
    title: '终端管理',
    icon: 'terminal',
    iconComonpent: 'MyIcon',
    path: '/terminal',
    authority: 'admin'
  },
  {
    title: '外设控制',
    icon: 'usb',
    path: '/device',
    authority: 'admin'
  },
  {
    title: '准入控制',
    icon: 'login',
    path: '/access',
    authority: 'admin'
  },
  {
    title: '用户管理',
    icon: 'yonghuguanli',
    iconComonpent: 'MyIcon',
    path: '/user',
    authority: 'admin'
  },
  {
    title: '系统日志',
    icon: 'log',
    iconComonpent: 'MyIcon',
    path: '/log',
    authority: 'admin',
    children: [
      {
        title: '桌面日志',
        icon: 'log',
        iconComonpent: 'MyIcon',
        path: '/vmlog',
        authority: 'admin'
      },
      {
        title: '终端日志',
        icon: 'log',
        iconComonpent: 'MyIcon',
        path: '/tclog',
        authority: 'admin'
      }
    ]
  }
]
export default menu
