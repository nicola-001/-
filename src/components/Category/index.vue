<script lang="ts">
export default {
  name: 'CateGory'
}
</script>
<script setup lang="ts">
import { onMounted } from 'vue'
// 引入相关的仓库
import useCategoryStore from '@/stores/modules/category'

const categorystore = useCategoryStore()

onMounted(() => {
  getc1()
})
// 通知仓库获取一级分类的数据
const getc1 = () => {
  categorystore.getc1()
}
// 通知仓库获取二级分类的数据
const handler = () => {
  // 清除二级三级分类的数据
  categorystore.c2Id = ''
  categorystore.c3Arr = []
  categorystore.c3Id = ''

  categorystore.getc2()
}
// 获取三击分类的数据
const handler1 = () => {
  // 清除三级分类的id
  categorystore.c3Id = ''
  categorystore.getc3()
}
// 接收属性管理父组件传过来的数据
defineProps(['scene'])
</script>

<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类" style="width: 280px">
        <el-select v-model="categorystore.c1Id" @change="handler" :disabled="scene==0?false:true">
          <el-option v-for="c1 in categorystore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" style="width: 280px">
        <el-select v-model="categorystore.c2Id" @change="handler1"  :disabled="scene==0?false:true">
          <el-option v-for="c2 in categorystore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" style="width: 280px">
        <el-select v-model="categorystore.c3Id"  :disabled="scene==0?false:true">
          <el-option v-for="c3 in categorystore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.el-select-dropdown__item {
  display: block !important; /* 强制块级显示 */
}
</style>