<script setup lang="ts">
import { getTime } from '@/untils/getTime'
import useUserStore from '@/stores/modules/user'

let userStore = useUserStore()

</script>

<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar">
      <div class="bottom">
        <h2>{{ getTime() }}好！{{ userStore.username }}</h2>
        <p>硅谷甄选运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome"  height="260px" width="500px"></svg-icon>
  </div>
</template>

<style scoped lang="scss">
.box{
  display: flex;
  .avatar{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom{
    display: flex;
    flex-direction: column;
    margin-left: 40px;
  }
  h2{
    margin-top: 30px;
    font-weight: 700;
  }
  p{
    margin-top: 30px;
    font-size: small;
    color: #8c939d;
  }
}
.bottoms{
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>