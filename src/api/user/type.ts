// 定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
export interface loginFromData {
  username: string,
  password: string
}

//定义全部接口返回都拥有的数据类型
export interface ResponseDate {
  code: number,
  message: string,
  ok: boolean
}

//定义登录接口返回数据类型
export interface loginResponseData extends ResponseDate {
  data: string
}

//定义获取用户信息返回的数据类型
export interface userInfoResponseDate extends ResponseDate {
  data: {
    routes: string[],
    buttons: string[],
    roles: string[],
    name: string,
    avatar: string
  }
}