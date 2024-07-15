export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface Attr {
  attrId: string | number,
  valueId: string | number,
}

export interface saleAttr {
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
  skuAttrValueList?: Attr [],
  skuSaleAttrValueList?: saleAttr [],
  skuDefaultImg: string,


}

//获取已有的sku的ts类型
export interface SkuResponseData extends ResponseData{
  data:{
    records:SkuData[],
    total: number,
    size: number,
    current: number,
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: number
  }
}