<script lang="ts">
export default {
  name: 'SKU'
}
</script>
<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { reqCancelSale, reqOnSale, reqRemoveSku, reqSkuInfo, reqSkuList } from '@/api/product/sku'
import { ElMessage } from 'element-plus'


//收集当前页码-默认第一页
let pageNo = ref<number>(1)
// 每页默认展示的数据
let pageSize = ref<number>(10)
// 存储数据
let skuArr = ref([])
let total = ref<number>(0)
// 控制抽屉的展示与隐藏
let drawer = ref<boolean>(false)
// 存储skuInfo的信息
let skuInfo = ref({})
// 页面加载完毕获取数据
onMounted(() => {
  getSku()
})
// 获取已有的sku
const getSku = async (pager = 1) => {
  // 获取第一页的数据
  pageNo.value = pager
  const result: any = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    skuArr.value = result.data.records
    total.value = result.data.total
  }
}
// 每页多少条数据
const handler = () => {
  // 当每页展示的数据发生变化时，由于v-model自动收集数据，所以会发送请求 默认展示第一页的数据
  getSku()
}
// 商品的上架与下架操作
const updateSale = async (row: any) => {

  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSale(row.id)
    ElMessage({
      type: 'success',
      message: '下架成功'
    })
    getSku(pageNo.value)
  } else {
    //   商家操作
    await reqOnSale(row.id)
    ElMessage({
      type: 'success',
      message: '上架成功'
    })
    getSku(pageNo.value)
  }
}
// 编辑
const updateSku = () => {
  ElMessage({
    type: 'warning',
    message: '程序员努力更新中...'
  })
}
// 查看商品的回调
const findSku = async (row: any) => {
  const result = await reqSkuInfo(row.id)
  if (result.code == 200) {
    skuInfo.value = result.data
    console.log(skuInfo.value)
  }
  // 展示抽屉
  drawer.value = true
}
// 删除商品的回调
const deleteSku = async (row: number) => {
  console.log(row.id)
  const result = await reqRemoveSku(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功！'
    })
    // 获取全部商品的数据
    getSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败！'
    })
  }
}

</script>

<template>
  <el-card>
    <!--表格-->
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #default="{row,$index}">
          <img :src="row.skuDefaultImg" style="width: 60px;" alt="">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #default="{row,$index}">
          <el-button type="success" size="small" :icon="row.isSale==1?'bottom':'top'"
                     @click="updateSale(row)"></el-button>
          <el-button type="info" size="small" icon="edit" @click="updateSku"></el-button>
          <el-button type="warning" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
          <el-popconfirm :title="`你确定要删除${row.skuName}吗？`" width="200" @confirm="deleteSku(row)">
            <template #reference>
              <el-button type="danger" size="small" icon="delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="true"
      :background="true"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getSku"
      @size-change="handler"
    />
    <!--右侧抽屉-->
    <el-drawer v-model="drawer" title="查看商品详情">
      <el-row style="margin: 5px 0">
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row style="margin: 5px 0">
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row style="margin: 5px 0">
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row style="margin: 5px 0">
        <el-col :span="6">平台属性</el-col>
        <el-col :span="18">
          <el-tag style="margin: 5px" type="warning" v-for="item in skuInfo.skuAttrValueList" :key="item.id">
            {{ item.valueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row style="margin: 5px 0">
        <el-col :span="6">销售属性</el-col>
        <el-col :span="18">
          <el-tag style="margin: 5px" type="primary" :key="item.id" v-for="item in skuInfo.skuSaleAttrValueList">
            {{ item.saleAttrValueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row style="margin: 5px 0">
        <el-col :span="6">商品图片</el-col>
        <el-col :span="18">
          <el-carousel :interval="4000" type="card" height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="height: 100%;width: 100%;">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>