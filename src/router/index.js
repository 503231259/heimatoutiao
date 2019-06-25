import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    component: () => import('@/views/layout'),
    // 嵌套路由
    children: [{
      name: 'home',
      path: '',
      component: () => import('@/views/home')
    }, {
      name: 'publish',
      path: '/publish',
      components: () => import('@/views/publish')
    }]
  }, {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login')
  }]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取到登录信息
  let userInfo = window.localStorage.getItem('user_info')
  // 想要去的路径不是登录页面
  if (to.path !== '/login') {
    // 如果 没有登录信息
    if (!userInfo) {
      //  跳转到登录页面
      next({ name: 'login' })
    } else {
      // 则通过
      next()
    }
  } else {
    // 看看是否有登录信息
    if (userInfo) {
      // 有 , 禁止跳转到登录页面
      next(false)
    } else {
      // 没有就到登录页面
      next()
    }
  }
})

export default router
