<script setup lang="ts">
import setting from '@/setting'
import useLayOutSettingStore from '@/stores/modules/setting'

let LayOutSettingStore = useLayOutSettingStore()
</script>
<script lang="ts">
export default {
  name: 'MyLogo'
}
</script>

<template>
  <div class="logo-wrapper" :class="{fold:LayOutSettingStore.fold?true:false}">
    <span>{{ setting.tittle }}</span>
  </div>
</template>

<style scoped lang="scss">
.logo-wrapper {
  width: 100%;
  height: $base-nav-hight;
  padding: 5px 20px;
  text-align: center;
  line-height: 20px;
  transition: all 0.3s;

  span {
    font-size: $base-nav-p;
    color: white;
    font-weight: 900;
  }
  &.fold{
    display: none;
  }
}
</style>