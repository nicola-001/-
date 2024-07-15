// SPU服务器全部接口返回的数据类型
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface SpuData {
  id: number,
  spuName: string,
  description: string,
  category3Id: number | string,
  tmId: number,
  spuSaleAttrList: null,
  spuImageList: null
}

//数组元素-已有的spuData的类型
export type Records = SpuData[]

//定义已有的Spu接口返回的ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
  },
}

//所有品牌数据的ts类型
export interface Trademark {
  id: number,
  tmName: string,
  logoUrl: string
}

//品牌接口返回的ts数据类型
export interface AllTrademark extends ResponseData {
  data: Trademark[]
}

//照片墙的ts数据类
export interface SpuImg {
  id: number,
  createTime: string,
  updateTime: string,
  spuId: number,
  imgName: string,
  imgUrl: string
}

//已有的spu照片墙返回数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

//已有销售属性值对象的类型
export interface SaleAttrValue {
  id?: number,
  createTime: string,
  updateTime: string,
  spuId: number,
  baseSaleAttrId: number,
  saleAttrValueName: string,
  saleAttrName: string,
  isChecked: null
}

//存储已有的销售属性值的数据类型
export type SpuSaleAttrValueList = SaleAttrValue[]

//销售属性对象的数据类型
export interface SaleAttr {
  id?: number,
  createTime: string,
  updateTime: string,
  spuId: number,
  baseSaleAttrId: number,
  saleAttrName: string,
  spuSaleAttrValueList: SpuSaleAttrValueList[]
}

//SPU已有的销售属性接口返回的数据类型
export interface SaleAttrResponDate extends ResponseData {
  data: SaleAttr[]
}

//已有的全部SPU的返回数据ts类型
export interface HasSaleAttr {
  id: number,
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: string | number,
  valueId: string | number,
}
export interface saleAttr{
  saleAttrId: string | number,
  saleAttrValueId: string | number,
}
//添加sku的ts类型
export interface SkuData {
  category3Id: string | number,
  spuId: string | number,
  tmId: string | number,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  skuAttrValueList?:Attr [],
  skuSaleAttrValueList?:saleAttr [],
  skuDefaultImg: string,


}