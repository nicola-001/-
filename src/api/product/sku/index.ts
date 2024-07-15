import request from '@/untils/request'
import type { SkuResponseData } from '@/api/product/sku/type'

// 获取已有商品的接口
enum API {
  // 获取全部已有的sku
  SKU_URL = '/admin/product/list/',
  //下架
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //上架
  ONSALE_URL = '/admin/product/onSale/',
  //获取商品详情信息
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  DELETESKU_URL = '/admin/product/deleteSku/'
}

//获取已有的sku
export const reqSkuList = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
//商品下架

export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)
// 商品上架
export const reqOnSale = (skuId: number) => request.get<any, any>(API.ONSALE_URL + skuId)
// 获取商品详情
export const reqSkuInfo = (skuId: number) => request.get<any, any>(API.SKUINFO_URL + skuId)
// 删除商品
export const reqRemoveSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId)
