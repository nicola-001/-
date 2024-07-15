// token的封装
// 设置token
export const setToken = (token: string) => {
  return localStorage.setItem('TOKEN', token)
}
//获取token
export const getToken = () => {
  return localStorage.getItem('TOKEN')
}

//清除token
export const REMOVE_TOKEN=()=>{
      return localStorage.removeItem('TOKEN')
}
