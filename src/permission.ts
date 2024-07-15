import router from '@/router'
import setting from '@/setting'
// @ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 获取用户小仓库的token数据
import useUserStore from '@/stores/modules/user'
// 在组件的外部不能获取小仓库的数据
import pinia from '@/stores'

// 取消导航条的转动
nprogress.configure({ showSpinner: false })
const userStore = useUserStore(pinia)
// 全局路由前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  // 设置标题
  document.title = `${setting.tittle} -${to.meta.title}`
  nprogress.start()
//  获取token,用token去判断用户是登陆还是未登录
  const token = userStore.token
  // 获取用户名字
  const username = userStore.username
  if (token) {
    // 用户登录成功 不能访问登录页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功访问除了登录页的其他页
      if (username) {
        next()
      } else {
        try {
          // 获取用户信息
          await userStore.userInfo()
          next()
        } catch (e) {
          // token过期 或 用户手动修改了token
          //  退出登录
          await userStore.userLoginOut()
          next({ path: '/login', query: to.path })
        }
      }
    }
  } else {
    //   用户未登录
    if (to.path == '/login') {
      next()
    } else {
      // 把未登录想登陆的路径用query的参数传递过去
      next({ path: '/login', query: { redirect: to.path } })
    }
  }

})
// 全局路由后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})