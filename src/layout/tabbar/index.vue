<script setup lang="ts">
import TabbarLeft from '@/layout/tabbar/tabbarLeft/index.vue'
import TabbarRight from '@/layout/tabbar/tabbarRight/index.vue'
</script>
<script lang="ts">
  export default {
    name:'tabBar'
  }
</script>
<template>
  <div class="tabbar_container">
    <TabbarLeft></TabbarLeft>
    <TabbarRight></TabbarRight>
  </div>
</template>

<style scoped lang="scss">
.tabbar_container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabbar_left {
    margin-left: 30px;
    display: flex;
    align-items: center;
  }
  .tabbar_right{
    padding: 0 30px;
    display: flex;
    align-items: center;
  }
}
</style>