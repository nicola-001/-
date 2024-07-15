import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { UserState } from '@/stores/type/type'
import { getToken, REMOVE_TOKEN, setToken } from '@/untils/token'
// 引入常量路由
import { constentRoute } from '@/router/routes'
import type { loginFromData, loginResponseData, userInfoResponseDate } from '@/api/user/type'

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      // 存储token信息
      // token: localStorage.getItem('TOKEN'),
      token: getToken(),
      menuRoutes: constentRoute,
      username: '',
      avatar: ''
    }
  },
  actions: {
    // 发送登陆请求
    async userLogin(data: loginFromData) {
      const result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        this.token = (result.data as string)
        // 使用浏览器的缓存保存token
        // localStorage.setItem('TOKEN', (result.data.token as string))
        setToken(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }

    },
    //获取用户信息
    async userInfo() {
      const result:userInfoResponseDate = await reqUserInfo()
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录操作
    async userLoginOut() {
      const result:any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }

    }
  }
})

export default useUserStore