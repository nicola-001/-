<script lang="ts">
export default {
  name: 'tabbarRight'
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
import { FullScreen, MoonNight, Refresh, Sunny, Tools } from '@element-plus/icons-vue'
import useLayOutSettingStore from '@/stores/modules/setting'
import useUserStore from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const layOutSettingStore = useLayOutSettingStore()

// 引入小仓库
let userStore = useUserStore()
// 引入路由器
let $router = useRouter()
// 获取路由对象
let $route = useRoute()
// 控制暗黑模式
const dark = ref<boolean>(false)
// 用于控制是否刷新
let refresh = () => {
  layOutSettingStore.refresh = !layOutSettingStore.refresh
}
// 控制是否全屏
let toggleFullscreen = () => {
  // 如果是全屏返回true 不是全屏 null
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
// 退出登录
let loginout = async () => {
  // 1.发送退出登录请求
  // 2.清除username avatar token
  // 3.路由跳转到登录页
  await userStore.userLoginOut()
  // 携带参数   等下次再次登陆时直接重定向到所带的路由
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
// switch开关的chenge事件进行暗黑模式qiehuan
const changeDark = () => {
  let html = document.documentElement
//   判断html标签是否有dark类名
  dark.value ? html.className = 'dark' : html.className = ''
}
// 修改主题颜色
const changeColor=()=>{
  console.log(123)
}
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
</script>

<template>
  <div class="tabbar_right">
    <el-button :icon="Refresh" circle @click="refresh" />
    <el-button :icon="FullScreen" circle @click="toggleFullscreen" />
    <el-popover placement="bottom" title="主题设置" :width="200" trigger="hover">
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker size="small" v-model="color" @change="changeColor" show-alpha :predefine="predefineColors" />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            @change="changeDark"
            size="small"
            v-model="dark"
            class="mt-2"
            style="margin-left: 24px"
            inline-prompt
            :active-icon="MoonNight"
            :inactive-icon="Sunny"
          />
        </el-form-item>
      </el-form>
      <template #reference>
        <el-button :icon="Tools" circle />
      </template>
    </el-popover>

    <img :src="userStore.avatar" style="height: 24px;width: 24px;margin: 0 10px;border-radius: 15px">
    <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
</style>