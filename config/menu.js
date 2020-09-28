/* eslint-disable no-param-reassign */
const menu = [
  {
    title: '首页',
    icon: 'home',
    iconComonpent: 'MyIcon',
    path: '/dashboard',
    authority: 'admin,security'
  },
  {
    title: '资源概览',
    path: '/resource',
    iconComonpent: 'MyIcon',
    icon: 'ziyuangailan',
    authority: 'admin,security'
  },
  {
    title: '桌面管理',
    path: '/vm',
    icon: 'zhuomianguanli1',
    iconComonpent: 'MyIcon',
    authority: 'admin,security',
    children: [
      {
        title: '桌面管理',
        icon: 'zhuomianguanli1',
        iconComonpent: 'MyIcon',
        path: '/desktop',
        authority: 'admin,security'
      },
      {
        title: '桌面池管理',
        icon: 'zhuomianchiguanli',
        iconComonpent: 'MyIcon',
        path: '/pool',
        authority: 'admin,security'
      },
      {
        title: '桌面组管理',
        icon: 'zhuomianzu11',
        iconComonpent: 'MyIcon',
        path: '/vmgroup',
        authority: 'admin,security'
      },
      {
        title: '模板管理',
        icon: 'mobanguanli',
        iconComonpent: 'MyIcon',
        path: '/template',
        authority: 'admin'
      },
      {
        title: '计划任务',
        icon: 'schedule',
        path: '/task',
        authority: 'admin'
      }
    ]
  },
  {
    title: '终端管理',
    icon: 'zhongduanguanli',
    path: '/tc',
    iconComonpent: 'MyIcon',
    authority: 'admin,security',
    children: [
      {
        title: '终端管理',
        icon: 'zhongduanguanli',
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
        icon: 'waishekongzhi',
        iconComonpent: 'MyIcon',
        path: '/device',
        authority: 'admin,security'
      },
      {
        title: '准入控制',
        icon: 'zhunrukongzhi',
        iconComonpent: 'MyIcon',
        path: '/access',
        authority: 'admin,security'
      },
      {
        title: '升级包管理',
        icon: 'shengjibao',
        iconComonpent: 'MyIcon',
        path: '/upgrade',
        authority: 'admin,security'
      }
    ]
  },
  {
    title: '用户管理',
    icon: 'yonghuguanli1',
    iconComonpent: 'MyIcon',
    path: '/user',
    authority: 'admin,security'
  },
  {
    title: '系统日志',
    icon: 'xitongrizhi',
    iconComonpent: 'MyIcon',
    path: '/log',
    authority: 'admin,security,audit',
    children: [
      {
        title: '桌面日志',
        icon: 'xitongrizhi',
        iconComonpent: 'MyIcon',
        authority: 'admin,security,audit',
        path: '/vmlog'
      },
      {
        title: '终端日志',
        icon: 'xitongrizhi',
        iconComonpent: 'MyIcon',
        authority: 'admin,security,audit',
        path: '/tclog'
      }
    ]
  }
]

const subMenu = menu
  .map(item => item.children && item.children.map(sitem => sitem.path))
  .flat()
  .filter(item => item)

const staticsMenu = [
  {
    name: '弹性计算',
    child: [
      {
        name: '云服务器',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '计算节点',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '实力规格',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '镜像服务',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '安全组',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '集群',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '裸金属服务',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '存储',
    child: [
      {
        name: '云硬盘',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '对象存储',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '磁盘类型',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '物理硬件',
    child: [
      {
        name: '物理机管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: 'DevOps',
    child: [
      {
        name: '系统概览',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '项目管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '代码管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '应用私服管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '应用管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '蓝图',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '组件管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '定时任务',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '软件仓库',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '镜像仓库',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '操作审计',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '容器',
    child: [
      {
        name: 'Kubernetes集群',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: 'AIOps',
    child: [
      {
        name: '异常点检测',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '网络',
    child: [
      {
        name: '网络拓扑',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '外部网络',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '虚拟机私有云(VPC)',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '虚拟网卡',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '弹性IP',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '弹性负载均衡',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '虚拟专用网络(VPN)',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '防火墙',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '系统管理',
    child: [
      {
        name: '云管理域',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '用户管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '项目管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '角色管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '日志管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '门户配置',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '平台资源概览',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '业务管理',
    child: [
      {
        name: '申请单',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '代办',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '工单管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '消息管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '产品管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '用户产品',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '云监控',
    child: [
      {
        name: '监控总览',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '资源管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '告警管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '拓扑',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '巡检',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '报表',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '系统管理',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '工作协同',
    child: [
      {
        name: '工作协同',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  },
  {
    name: '应用性能监控',
    child: [
      {
        name: '总览',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '报表',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '探针',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      },
      {
        name: '授权',
        link: 'https://182.150.63.26:20001/ccsvm/webadmin/#dashboard-main '
      }
    ]
  }
]
export default menu
export { subMenu, staticsMenu }
