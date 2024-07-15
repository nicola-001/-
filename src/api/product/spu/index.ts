import request from '@/untils/request'
import type {
  AllTrademark,
  HasSaleAttrResponseData,
  HasSpuResponseData,
  SaleAttrResponDate, SkuData,
  SpuHasImg
} from '@/api/product/spu/type'

enum API {
  // 获取已有商品SPU的数据
  HASSPU_URL = '/admin/product/',
  // 获取已有品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个商品下的全部售卖商品图片的数据
  IMG_URL = '/admin/product/spuImageList/',
  //获取某个SPU下的全部已有销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //追加新的spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的spu
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看spu下面的全部商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/'


}

//获取某一个三级分类下已有的SPU接口
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
//获取全部spu品牌的数据
export const reqAllTrademark = () => request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)
//获取某个商品下的全部售卖商品图片的数据
export const reqSpuImgList = (spuId: number) => request.get<any, SpuHasImg>(API.IMG_URL + spuId)
//获取某个SPU下的全部已有销售属性接口地址
export const reqSpuHassaleAttrList = (spuId: number) => request.get<any, SaleAttrResponDate>(API.SPUHASSALEATTR_URL + spuId)
//获取全部销售属性
export const reqAllAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
//追加新的spu
export const reqAddOrUpdateSpu = (data: any) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
// 添加SKU请求方法
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)
//获取spu下的所有sku商品
export const reqSkuList = (spuId: number|string) => request.get<any, any>(API.SKUINFO_URL + spuId)
//删除已有的Spu
export const reqRemoveSpu = (spuId: number|string) => request.delete(API.REMOVESPU_URL + spuId)