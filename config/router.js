import { dynamic } from '../mint'
import { UserLayout } from '../src/layouts'
// TODO 添加404页面
function getRouterConfig(app) {
  const routerConfig = [
    {
      path: '/login',
      component: UserLayout,
      routes: [
        {
          path: '/login',
          component: dynamic({
            app,
            models: () => [import('../src/models/login')],
            component: () => import('../src/pages/Login')
          })
        }
      ]
    },
    {
      path: '/',
      authority: 'SYSTEM_MGR,HR_MGR,ADMIN_MGR,PROJECT_MGR,STAFF',
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
        }
      ]
    }
  ]

  return routerConfig
}

export default getRouterConfig
