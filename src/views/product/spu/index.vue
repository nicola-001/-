<script setup lang="ts">
import CateGory from '@/components/Category/index.vue'
import { onBeforeMount, ref, watch } from 'vue'
import useCategoryStore from '@/stores/modules/category'
import { reqHasSpu, reqRemoveSpu, reqSkuList } from '@/api/product/spu'
import type { Records, SpuData } from '@/api/product/spu/type'
import SkuFrom from '@/views/product/spu/skuFrom.vue'
import SpuFrom from '@/views/product/spu/spuFrom.vue'
import { ElMessage } from 'element-plus'
// 定义数据用于场景展示
let scene = ref<number>(0) //0:table页 1:添加或修改spu 2：添加sku
// 定义分页器初始第几页
let pageNo = ref<number>(1)
// 定义分页器每页几条数据
let pageSize = ref<number>(3)
// 用于定义分页器获取到数据的总条数
let total = ref<number>(0)
// 获取仓库中c3Id的数据，用于控制发送请求的时机
const categorystore = useCategoryStore()
// 定义一个变量用于存储返回来的数据
let records = ref<Records>([])
// 获取子组建实例vc
let spu = ref<any>()
let sku = ref<any>()
// 存储全部的SKU数据
let skuArr = ref<any>([])
// 定义一个变量，用于控制dialog显示隐藏
let show = ref<boolean>(false)
// 监听c3id,若是有数据则发送请求获取数据
watch(() => categorystore.c3Id, () => {
  // 保证要有三级分类的id否则获取不到数据
  if (!categorystore.c3Id) return
  // 获取数据
  getHasSpu()
})
// 封装获取三级分类下的所有数据
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  const result = await reqHasSpu(pageNo.value, pageSize.value, categorystore.c3Id)
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 分页器下拉菜单发生变化触发
const chengeSize = () => {
  getHasSpu()
}
// 添加SPU的回调
const addSpu = () => {
  // 切换场景
  scene.value = 1
//   使用子组建的实例-添加新的spu
  spu.value.initAddSpu(categorystore.c3Id)
}
// 修改SPU的回调
const updateSpu = (row: SpuData) => {
  // 切换场景
  scene.value = 1
  //调用子组建的方法获取完整的spu实例
  spu.value.initHasSpuData(row)
}
// 子组建spuFrom绑定自定义事件，让子组建通知父组件切换场景为0
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    // 更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    // 添加留在第一页
    getHasSpu()
  }
}
// 添加sku
const addSku = (row: any) => {
  scene.value = 2
//   调用子组建中的方法
  sku.value.initSkuData(categorystore.c1Id, categorystore.c2Id, row)
}
// 查看spu下的所有商品sku
const findSku = async (row: any) => {
  let result: any = await reqSkuList(row.id)
  console.log(result)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}
// 删除spu的商品的回调
const deleteSpu = async (row: any) => {
  let result = await reqRemoveSpu(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
    // 获取数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败！'
    })
  }
}
// 清除仓库的数据
onBeforeMount(() => {
  categorystore.$reset()
})
</script>
<script lang="ts">
export default {
  name: 'SPU'
}
</script>
<template>
  <!-- 三级分类-->
  <CateGory :scene="scene" />
  <!--table列表-->
  <el-card style="margin-top: 10px;">
    <div v-show="scene==0">
      <el-button type="primary" icon="plus" :disabled="categorystore.c3Id?false:true" @click="addSpu">添加SPU
      </el-button>
      <!--table表格 展示已有的数据-->
      <el-table border style="margin: 20px 0" :data="records">
        <el-table-column label="序号" type="index" align="center" width="80" />
        <el-table-column label="SPU名称" prop="spuName"  />
        <el-table-column label="SPU描述" prop="description" />
        <el-table-column label="SPU操作">
          <template #default="{row,$index}">
            <el-button type="success" icon="Plus" size="small" @click="addSku(row)" title="添加SKU"></el-button>
            <el-button type="primary" icon="edit" size="small" title="编辑SPU" @click="updateSpu(row)"></el-button>
            <el-button type="info" size="small" icon="view" title="查看SKU" @click="findSku(row)"></el-button>
            <el-popconfirm :title="`你确定要删除${row.spuName}吗？`" width="200" @confirm="deleteSpu(row)">
              <template #reference>
                <el-button type="danger" size="small" icon="delete" title="删除SPU"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
      <!--分页器-->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3,5,7,9]"
        :small=true
        :background=true
        layout=" prev, pager, next, jumper,->,sizes,total,"
        :total="total"
        @size-change="chengeSize"
        @current-change="getHasSpu"
      />
    </div>
    <spu-from v-show="scene==1" @changeScene="changeScene" ref="spu" />
    <sku-from v-show="scene==2" @changeScene="changeScene" ref="sku" />
    <el-dialog title="SKU列表" v-model="show">
      <el-table border :data="skuArr">
        <el-table-column label="SKU名字" prop="skuName"></el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #default="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="height: 100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>

</template>

<style>

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.el-select-dropdown__item {
  display: block !important; /* 强制块级显示 */
}
</style>