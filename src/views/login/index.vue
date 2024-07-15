<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/untils/getTime'
import { useRoute } from 'vue-router'

const loginFrom = reactive({ username: 'admin', password: '111111' })

let useStore = useUserStore()
let $router = useRouter()
// 获取路由对象
let $route = useRoute()
let loading = ref(false) //按钮加载的效果
//(登录的回调) 点击登录按钮==>发送登陆请求 1.成功 跳转 2.失败 弹出错误信息
const login = async () => {
  loading.value = true
  try {
    await useStore.userLogin(loginFrom)
    // 登陆的时候判断书否有query参数，如果有  跳转到所携带的query参数， 没有往首页跳转
    let redirect:any = $route.query.redirect
    await $router.push({ path: redirect || '/' })
    loading.value = false
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `HI,${getTime()}好!`
    })
  } catch (e) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (e as Error).message
    })
  }
}
// 验证用户名的表单规则
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少5位'))
  }
}

// 验证密码的表单规则
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}
// 验证表单规则
const rules = reactive({
  username: [
    { trigger: 'change', validator: validatorUsername }
  ],
  password: [
    { required: true, validator: validatorPassword }
  ]
})


</script>

<template>
  <div class="login_cotainer">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form class="el_from" :rules="rules" :model="loginFrom">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginFrom.username" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" show-password v-model="loginFrom.password" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" class="el_btn" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.login_cotainer {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.el_from {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url("@/assets/images/login_form.png") no-repeat;
  background-size: cover;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0;
  }

  .el_btn {
    width: 100%;
  }
}
</style>