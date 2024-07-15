//统一管理用户信息的接口
import request from '@/untils/request'
import type { loginFromData, loginResponseData, userInfoResponseDate } from './type'

//枚举项目用户相关的请求地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 登录接口
export const reqLogin = (data: loginFromData) => request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息
export const reqUserInfo = () => request.get<any, userInfoResponseDate>(API.USERINFO_URL)
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)