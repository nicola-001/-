// 用户管理模块的接口
import request from '@/untils/request'
import type { UserResponseData } from '@/api/acl/user/type'

enum API {
//   获取全部已有用户信息的接口
  ALLUSER_URL = '/admin/acl/user/',
  // 添加用户
  ADDUSER_URL = '/admin/acl/user/save',
  // 修改用户
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取用户已有的职位、所有的职位
  ASSIGNUSER_URL = '/admin/acl/user/toAssign/',
  //给已有的角色分配角色
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 批量删除某些用户
  DELETEALL_URL = '/admin/acl/user/batchRemove'

}

//获取用户账号信息
export const reqAllUsrInfo = (page: number, limit: number, username: string) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
//添加用户或修改用户的接口
export const reqAddOrUpdateUser = (data: any) => {
  // 携带id->更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    //   添加
    return request.post<any, any>(API.ADDUSER_URL, data)
  }

}
//获取用户已有的职位、所有的职位
export const reqAssignUser = (adminId: number) => request.get<any, any>(API.ASSIGNUSER_URL + adminId)
//分配角色
export const reqSerUserRole = (data: any) => request.post<any, any>(API.SETROLE_URL, data)
//删除某一个账户
export const reqRemoveUser = (id: number) => request.delete<any, any>(API.DELETEUSER_URL + id)
//批量删除的接口
export const reqSelectUser = (idList: any) => request.delete<any, any>(API.DELETEALL_URL, { data: idList })