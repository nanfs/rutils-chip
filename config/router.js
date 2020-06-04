import { dynamic } from '../mint'

function getRouterConfig(app) {
  const routerConfig = [
    {
      path: '/login',
      authority: 'all',
      component: dynamic({
        app,
        models: () => [],
        component: () => import('../src/pages/Login')
      })
    },
    {
      path: '/',
      authority: 'admin,security,audit',
      component: dynamic({
        app,
        models: () => [import('../src/models/app')],
        component: () => import('../src/layouts/BasicLayout')
      }),
      routes: [
        {
          path: '/dashboard',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Dashboard/index')
          })
        },
        {
          path: '/resource',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Resource/index')
          })
        },
        {
          path: '/desktop',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Desktop/index')
          })
        },
        {
          path: '/pool',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Pool/index')
          })
        },
        {
          path: '/template',
          authority: 'admin',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Template/index')
          })
        },
        {
          path: '/terminal',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Terminal/index')
          })
        },
        {
          path: '/device',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Device/index')
          })
        },
        {
          path: '/access',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Access/index')
          })
        },
        {
          path: '/label',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Label/index')
          })
        },
        {
          path: '/user',
          authority: 'admin,security',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/User/index')
          })
        },
        {
          path: '/task',
          authority: 'admin',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Task/index')
          })
        },
        {
          path: '/terminalTask',
          authority: 'admin',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/TerminalTask/index')
          })
        },
        {
          path: '/vmlog',
          authority: 'admin,security,audit',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Vmlog/index')
          })
        },
        {
          path: '/tclog',
          authority: 'admin,security,audit',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('../src/pages/Tclog/index')
          })
        }
      ]
    }
  ]

  return routerConfig
}

export default getRouterConfig
