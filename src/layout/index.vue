<script setup lang="ts">
import Logo from '@/layout/Logo/index.vue'
import Menu from '@/layout/Menu/index.vue'
import useUserStore from '@/stores/modules/user'
import Main from '@/layout/Main/index.vue'
import { useRoute } from 'vue-router'
import Tabbar from '@/layout/tabbar/index.vue'
import useLayOutSettingStore from '@/stores/modules/setting'

let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
// 获取路由信息
let $route = useRoute()
</script>
<script lang="ts">
export default {
  name: 'LayOut'
}
</script>

<template>
  <div class="layout_container">
    <!--左侧导航-->
    <div class="layout_slider" :class="{fold:LayOutSettingStore.fold?true:false}">
      <el-scrollbar>
        <!--顶部logo-->
        <Logo></Logo>
        <!--动态生成菜单组建-->
        <el-menu :collapse="LayOutSettingStore.fold?true:false" :default-active="$route.path" background-color="#001529"
                 text-color="white">
          <!-- 传递路由数据给menu组件 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--顶部-->
    <div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold?true:false}">
      <Tabbar></Tabbar>
    </div>
    <!--内容区-->
    <div class="layout_main" :class="{fold:LayOutSettingStore.fold?true:false}">
      <el-scrollbar height="high">
        <Main></Main>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
}

.layout_slider {
  height: 100vh;
  max-height: 100vh;
  width: $base-menu-width;
  background-color: $base-menu-background;
  transition: all 0.3s;

  .scrollbar {
    width: 100%;
    height: calc(100vh - $base-nav-hight);

    .el-menu {
      border-right: none;
    }
  }

  &.fold {
    width: $base-menu-min-width;
  }
}


.layout_tabbar {
  width: calc(100% - $base-menu-width);
  height: $base-tabbar-hight;
  position: fixed;
  top: 0;
  left: calc($base-menu-width);
  transition: all 0.3s;

  &.fold {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;
  }
}

.layout_main {
  width: calc(100% - $base-menu-width);
  height: calc(100vh - $base-tabbar-hight);
  position: absolute;
  top: $base-tabbar-hight;
  left: $base-menu-width;
  padding: 20px;
  transition: all 0.3s;

  &.fold {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;
  }
}
</style>