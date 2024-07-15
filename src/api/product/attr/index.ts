import request from '@/untils/request'
import type { AttrResponseData, CategoryResponseDate } from '@/api/product/attr/type'

enum API {
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  ATTR_URL = '/admin/product/attrInfoList/',
  ADDORUPDATE_URL = '/admin/product/saveAttrInfo',
  DELETE_URL = '/admin/product/deleteAttr/'
}

//获得一级分类的方法
export const reqc1 = () => request.get<any, CategoryResponseDate>(API.C1_URL)
//获得二级分类的方法
export const reqc2 = (category1Id: number | string) => request.get<any, CategoryResponseDate>(API.C2_URL + category1Id)
//获得三级分类的方法
export const reqc3 = (category2Id: number) => request.get<any, CategoryResponseDate>(API.C3_URL + category2Id)
//获取属性以及属性值的方法
export const reqAttr = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`)
//新增或更新属性的方法
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATE_URL, data)
//删除某个已有属性的方法
export const reqRemoveAttr = (attrId: number) => request.delete<any, any>(API.DELETE_URL + attrId)