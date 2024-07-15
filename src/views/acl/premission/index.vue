<script lang="ts">
export default {
  name: 'MeNu'
}
</script>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { reqAddOrUpdateMenu, reqAllPermission, reqRemoveMenu } from '@/api/acl/menu'
import { ElMessage } from 'element-plus'
// 定义参数存储数据
const permissionARR = ref([])
// 控制对话框的显示隐藏
const dialogVisible = ref<boolean>(false)
// 携带的参数
let menuData = reactive<any>({
  name: '',
  code: '',
  level: 0,
  id: 0,
  pid: 0
})
onMounted(() => {
  getHasPermission()
})
// 获取全部菜单与按钮标识的数据
const getHasPermission = async () => {
  const result: any = await reqAllPermission()
  if (result.code == 200) {
    permissionARR.value = result.data
  }
}
// 添加菜单权限
const addPermission = (row: any) => {
  // 显示对话框
  dialogVisible.value = true
  //  收集添加数据数据
  menuData.level = row.level + 1
  menuData.pid = row.id
  // 清空对话框
  Object.assign(menuData, {
    name: '',
    code: '',
    level: 0,
    id: 0,
    pid: 0
  })
}
// 修改菜单的权限
const updatePermssion = (row: any) => {
  // 显示对话框
  dialogVisible.value = true
  // 将数据赋值给menuData
  Object.assign(menuData, row)
}
// 确定按钮的回调
const save = async () => {
  //发送添加或修改菜单请求
  const result = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    // 关闭对话框
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功'
    })
    //   重新获取数据
    getHasPermission()
  } else {
    ElMessage({
      type: 'error',
      message: menuData.id ? '修改失败' : '添加失败'
    })
  }

}
// 删除菜单
const removeMenu = async (row: any) => {
  const result = await reqRemoveMenu(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    //   重新获取数据
   await getHasPermission()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>

<template>
  <el-table
    :data="permissionARR"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column label="名称" prop="name" />
    <el-table-column label="权限值" prop="code" />
    <el-table-column label="修改时间" prop="updateTime" />
    <el-table-column label="操作">
      <template #default="{row,$index}">
        <el-button type="primary" size="small" @click="addPermission(row)" :disabled="row.level===4?true:false">
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button type="success" size="small" :disabled="row.level===1?true:false" @click="updatePermssion(row)">编辑
        </el-button>
        <el-popconfirm :title="`你确定要删除${row.name}吗？`" width="260" @confirm="removeMenu(row)">
          <template #reference>
            <el-button type="danger" size="small" :disabled="row.level===1?true:false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!--dialog对话框-->
  <el-dialog v-model="dialogVisible" :title="menuData.id?'更新菜单':'添加菜单'" width="500px">
    <el-form>
      <el-form-item label="名称" label-width="80px">
        <el-input placeholder="请输入名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值" label-width="80px">
        <el-input placeholder="请输入权限值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>