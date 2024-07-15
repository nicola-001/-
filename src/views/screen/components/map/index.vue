<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
//引入中国地图的JSON数据
import chinaJSON from './china.json'
//获取DOM元素
let map = ref();
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(()=>{
  let mychart = echarts.init(map.value);
  mychart.setOption({
    //地图组件
    geo: {
      map: 'china',//中国地图
    },
  })
})
</script>

<template>
  <div class="box4" ref="map">
    我是地图组件
  </div>
</template>

<style scoped>

</style>