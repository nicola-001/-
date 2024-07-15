// 品牌管理的接口
import request from '@/untils/request'
import type { TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type'

enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/'
}

// 获取已有品牌的接口
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
//添加或修改品牌的接口
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    //   修改已有品牌的数据
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //   新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

//删除已有品牌的接口
export const reqDeleteTrademark=(id:number)=>request.delete<any,any>(API.DELETETRADEMARK_URL+`${id}`)