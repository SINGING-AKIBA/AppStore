import { createRouter, createWebHashHistory } from 'vue-router'
import BasicLayout from '@/layout/BasicLayout.vue'
import UserLayout from '@/layout/UserLayout.vue'
import RouteView from '@/layout/RouteView.vue'
import error from '@/views/error/404.vue'
// 前端未找到页面路由（固定不用改）
export const notFoundRouter = {
    path: '*',
    redirect: '/404',
    name:'404',
}
// 根级菜单
export const rootRouter = {
    name: 'home',
    path: '/',
    component: BasicLayout,
    redirect: '',
    children: []
}
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      component: UserLayout,
      redirect: '/admin/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/admin/Login.vue')
        }
      ]
    },
    {
      path: '/404',
      name: '404',
      component: error
    },
    {
      path: '/data',
      component: RouteView,
      redirect: '/data/index',
      children: [
        {
          path: 'index',
          name: 'dataIndex',
          component: () => import('@/views/data/Index.vue')
        }
      ]
    }
  ],
})
export default router
