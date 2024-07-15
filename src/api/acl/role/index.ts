// 角色管理的接口
import request from '@/untils/request'

enum API {
// 获取全部职位的接口
  ALLROLE_URL = '/admin/acl/role/',
//   新增岗位
  ADDROLE_URL = '/admin/acl/role/save',
//   更新已有岗位
  UPDATEROLE_URL = '/admin/acl/role/update',
//   获取全部的菜单按钮的权限
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  //删除角色
  DELETEROLE_URL = '/admin/acl/role/remove/'
}

//获取全部职位的接口
export const reqAllRole = (page: number, limit: number, roleName: string) => request.get<any, any>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
//添加职位与更新职位的接口
export const reqAddOrUpdateRole = (data: any) => {
//   如果携带id->更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
//   获取全部的菜单按钮的权限
export const reqAllPermission = (roleId: number) => request.get<any, any>(API.ALLPERMISSION_URL + roleId)
//   分配权限
export const reqSetPermission = (roleId: number, permissionId: number) => request.post<any, any>(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)
//删除角色
export const reqDeleteRole = (id: number) => request.delete<any, any>(API.DELETEROLE_URL + id)