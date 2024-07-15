<script lang="ts">
export default {
  name: 'skuFrom'
}
</script>
<script setup lang="ts">
import { reqAddSku, reqSpuHassaleAttrList, reqSpuImgList } from '@/api/product/spu'
import { reactive, ref } from 'vue'
import { reqAttr } from '@/api/product/attr'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
// 获取table vc实例
let table = ref<any>()
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片的数据
let imgArr = ref<any>([])
// 收集sku的参数
let skuParams = reactive<SkuData>({
  // 父组件传递过来的数据
  category3Id: '',
  spuId: '',
  tmId: '',
  // v-model收集的数据
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: ''
})
let $emit = defineEmits(['changeScene'])
// 当前子组建对外暴露的方法
const initSkuData = async (c1Id: any, c2Id: any, spu: any) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)

  //获取销售属性
  let result1: any = await reqSpuHassaleAttrList(spu.id)

  // 获取图片信息
  let result2 = await reqSpuImgList(spu.id)
  // 存储平台数据
  attrArr.value = result.data
  // 存储销售属性
  saleArr.value = result1.data
  // 存储照片的数据
  imgArr.value = result2.data
}
// 保存按钮的回调
const save = async () => {
//   整理参数
//   平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueID) {
      let [attrId, valueId] = next.attrIdAndValueID.split(':')
      prev.push(
        {
          attrId,
          valueId
        }
      )
    }
    return prev
  }, [])
//   销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push(
        {
          saleAttrId,
          saleAttrValueId
        }
      )
    }
    return prev
  }, [])
//   发送请求
  let result = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功！'
    })
    //   通知父组件切换为场景0
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败！'
    })
  }
}
// 取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
// 设置默认图片方法的回调
const handler = (row: any) => {
  // table复选框
  // 设置排他思想
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  // 将选中的图片对应行勾选
  table.value.toggleRowSelection(row, true)
  // 获取图片地址
  skuParams.skuDefaultImg = row.imgUrl
}
defineExpose({ initSkuData })
</script>
<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="请输入SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="请输入SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item style="width: 200px;" v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueID">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="attrValue in item.attrValueList "
                       :key="attrValue.id"
                       :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item :label="item.saleAttrName" style="width: 200px;" v-for="item in saleArr" :key="item.id">
          <el-select v-model="item.saleIdAndValueId">
            <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for="saleAttrValue in item.spuSaleAttrValueList"
                       :key="saleAttrValue.id"
                       :label="saleAttrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{row,$index}">
            <img :src="row.imgUrl" alt="" style="width: 100px">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #default="{row,$index}">
            <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>