import request from '@/untils/request'

enum API {
//   获取全部菜单与按钮标识的数据
  ALLPERMISSION_URL = '/admin/acl/permission',
//   新增菜单管理
  ADDMENU_URL = '/admin/acl/permission/save',
//   跟更新已有的菜单
  UPDATEMENU_URL = '/admin/acl/permission/update/',
//   删除已有的菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/'
}

//获取菜单的数据
export const reqAllPermission = () => request.get<any, any>(API.ALLPERMISSION_URL)
//添加或修改菜单
export const reqAddOrUpdateMenu = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}
//删除已有的菜单
export const reqRemoveMenu=(id:number)=>request.delete<any,any>(API.DELETEMENU_URL+id)