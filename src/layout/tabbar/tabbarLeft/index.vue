<script setup lang="ts">
import { ArrowRight, Expand, Fold } from '@element-plus/icons-vue'
import useLayOutSettingStore from '@/stores/modules/setting'
import { useRoute } from 'vue-router'

let LayOutSettingStore = useLayOutSettingStore()
let chengeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
const $route = useRoute()


</script>
<script lang="ts">
export default {
  name: 'tabbarLeft'
}
</script>

<template>
  <div class="tabbar_left">
    <!--展开还原图标-->
    <el-icon style="margin-right: 10px;" @click="chengeIcon">
      <component :is="LayOutSettingStore.fold?Fold:Expand"></component>
    </el-icon>
    <!--面包屑-->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index"
                          v-show="item.meta.title"  :to="item.path">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span style="margin-left: 5px">{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped>

</style>