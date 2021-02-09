import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '../store/'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login'),
    meta: { requestAuth: false }
  },
  {
    path: '/',
    component: () => import('../views/layout'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/home/'),
        meta: { requestAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('../views/qa/'),
        meta: { requestAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('../views/video/'),
        meta: { requestAuth: false }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('../views/my/'),
        meta: { requestAuth: false }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search'),
    meta: { requestAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('../views/article'),
    props: true,
    meta: { requestAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('../views/user-profile'),
    meta: { requestAuth: false }
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('../views/user-chat'),
    meta: { requestAuth: true }
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫 判断当前页面跳转是否需要 登录才能访问
// 参考文档：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB
// to: 要访问的页面路由信息
// from： 来自哪个方面的路由信息
// next： 放行的标记
// 验证页面是否需要登录状态
router.beforeEach((to, from, next) => {
  if (to.meta.requestAuth) {
    // 验证登录状态
    // 如果已登录，则直接通过
    if (store.state.user) {
      return next()
    }
    // 校验登录状态，提示用户
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗？'
    })
      .then(() => {
        // 确认执行这里
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => {
        // 取消执行这里
        // 取消登录，中断路由导航
        // next(false): 中断当前的导航。如果浏览器的 URL 改变了
        // (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
        next(false)
      })
  } else {
    // 不需要登录的情况，直接跳过
    next()
  }
})

export default router
