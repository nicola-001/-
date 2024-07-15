<script lang="ts">
export default {
  name: 'screenData'
}
</script>
<script setup lang="ts">
//scale的自适应
// 1.设置基本宽高，注意要设置基准
// 2.定义放大缩小比例
// 3.让盒子内的元素的style=放大缩小比例（给他拉回来）
import { onMounted, ref } from 'vue'
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Couter from './components/couter/index.vue'
// 获取数据大屏内的盒子元素
let screen = ref()

// 定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}

// 监听视口的变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
</script>

<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="tourist">
            <Tourist></Tourist>
          </div>
          <div class="sex">
            <Sex></Sex>
          </div>
          <div class="age">
            <Age></Age>
          </div>
        </div>
        <div class="center">
          <div class="map">
            <Map></Map>
          </div>
          <div class="line">
            <Line></Line>
          </div>
        </div>
        <div class="right">
          <div class="rank">
            <Rank></Rank>
          </div>
          <div class="year">
            <Year></Year>
          </div>
          <div class="couter">
            <Couter></Couter>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url("./images/bg.png") no-repeat;
  background-size: cover;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    //设置基点
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
          background-color: skyblue;
        }

        .age {
          flex: 1;
          background-color: gold;
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        .rank{
          flex: 1.2;
        }
        .year{
          flex: 1;
        }
        .couter{
          flex: 1;
        }
      }

      .center {
        flex: 2;
        display: flex;
        flex-direction: column;

        .map {
          flex: 3;
        }

        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>