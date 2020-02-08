import { dynamic } from '../mint'

function getRouterConfig(app) {
  const routerConfig = [
    {
      path: '/login',
      component: dynamic({
        app,
        models: () => [import('../src/models/login')],
        component: () => import('../src/pages/Login')
      })
    },
    {
      path: '/',
      authority: '',
      component: dynamic({
        app,
        models: () => [import('../src/models/app')],
        component: () => import('../src/layouts/BasicLayout')
      }),
      routes: [
        {
          path: '/dashboard',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Dashboard/index')
          })
        },
        {
          path: '/resource',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Resource/index')
          })
        },
        {
          path: '/desktop',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Desktop/index')
          })
        },
        {
          path: '/pool',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Pool/index')
          })
        },
        {
          path: '/template',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Template/index')
          })
        },
        {
          path: '/terminal',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Terminal/index')
          })
        },
        {
          path: '/device',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Device/index')
          })
        },
        {
          path: '/access',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Access/index')
          })
        },
        {
          path: '/vmlog',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Vmlog/index')
          })
        },
        {
          path: '/tclog',
          component: dynamic({
            app,
            models: () => [import('../src/models/dashboard')],
            component: () => import('../src/pages/Tclog/index')
          })
        }
      ]
    }
  ]

  return routerConfig
}

export default getRouterConfig
