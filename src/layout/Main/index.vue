<script setup lang="ts">
import useLayOutSettingStore from '@/stores/modules/setting'
import { nextTick, ref, watch } from 'vue'

const layOutSettingStore = useLayOutSettingStore()
let flag = ref(true)
// 监听仓库内部的数据
watch(() => layOutSettingStore.refresh, () => {
  flag.value = false
  //下次dom更新循环之后
  nextTick(() => {
    flag.value = true
  })
})

</script>
<script lang="ts">
export default {
  name: 'MyMain'
}
</script>
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染一级路由的子路由-->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<style scoped>
/* 路由切换动画 */
/* fade-transform */

.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s;
}


.fade-enter-to {
  opacity: 1;
}
</style>