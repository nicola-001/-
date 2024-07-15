<script lang="ts">
export default {
  name: 'UserRole'
}
</script>
<script setup lang="ts">
import { UserFilled, Edit, Delete } from '@element-plus/icons-vue'
import { nextTick, onMounted, reactive, ref } from 'vue'
import useLayOutSettingStore from '@/stores/modules/setting'
import {
  reqAddOrUpdateUser,
  reqAllUsrInfo,
  reqAssignUser,
  reqRemoveUser,
  reqSelectUser,
  reqSerUserRole
} from '@/api/acl/user'
import type { Records, UserResponseData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'

//分页器默认展示第几页
let pageNo = ref<number>(1)
// 分页器每页展示多少条数据
let pageSize = ref<number>(5)
// 用户总个数
let total = ref<number>(0)
// 定义用于存储用户信息的数组
let userArr = ref<Records>([])
// 用于控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 用于控制分配角色的显示与隐藏
let drawer1 = ref<boolean>(false)
// 获取表单实例vc
let ruleFormRef = ref()
// 收集用户信息的响应式数据
let userParams = reactive({
  username: '',
  name: '',
  password: ''
})
// 存储所有角色的数据
let allRole = ref([])
// 存储已有角色的数据
let userRole = ref([])
//设置不确定状态，仅负责样式控制
const isIndeterminate = ref<boolean>(true)
// 全选按钮是否勾选
const checkAll = ref<boolean>(false)
// 定义一个数组用于存储批量删除的id
let selectUser = ref([])
// 收集用户输入的关键字
let keyword = ref<string>('')
// 获取仓库中的数据
let layOutSettingStore = useLayOutSettingStore()
// 挂载完毕获取数据
onMounted(() => {
  // 获取已有用户信息
  getHasUser()
})
// 获取已有用户信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqAllUsrInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
// 分页器的选择每页展示几条数据(下拉菜单)
const handler = () => {
  getHasUser()
}
// 添加用户的回调
const addUser = () => {
  // 打开抽屉
  drawer.value = true
  //清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
//   移除表单的校验结果
  nextTick(() => {
    ruleFormRef.value.clearValidate(['username'])
    ruleFormRef.value.clearValidate(['name'])
    ruleFormRef.value.clearValidate(['password'])
  })
}
// 修改用户的回调
const updateUser = (row: any) => {
  // 打开抽屉
  drawer.value = true
  //给表单赋值
  Object.assign(userParams, row)
  //   移除表单的校验结果
  nextTick(() => {
    ruleFormRef.value.clearValidate(['username'])
    ruleFormRef.value.clearValidate(['name'])
  })
}
// 确定按钮的回调
const save = async () => {
  // 表单验证通过之后返回一个promise返回成功之后  继续发请求
  await ruleFormRef.value.validate()
  const result = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '修改成功' : '添加成功'
    })
    // 关闭抽屉
    drawer.value = false
    //   重新获取数据
    await getHasUser(userParams.id ? pageNo.value : 1)
    //   浏览器重新刷新依次
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '修改失败' : '添加失败'
    })
  }
}
// 取消按钮的回调
const cancel = () => {
  // 关闭抽屉
  drawer.value = false
}
// 验证用户名的回调
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户名字至少是5位'))
  }
}
// 验证用户昵称的回调
const validateName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称至少是5位'))
  }
}
// 验证用户昵称的回调
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('密码至少是6位'))
  }
}
// 表单校验规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }]
}
// 分配角色的回调
const setRole = async (row: any) => {
  Object.assign(userParams, row)
  // 发送请求获取数据
  const result = await reqAssignUser(row.id)
  if (result.code == 200) {
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    // 打开分配角色的抽屉
    drawer1.value = true
  }
}
// 全选按钮是否勾选的回调
const handleCheckAllChange = (val: boolean) => {
  // true全选 false 没有全选
  userRole.value = val ? allRole.value : []
  // 不确定样式
  isIndeterminate.value = false
}
// 全选按钮下面的子按钮是否勾选的回调
const handleCheckedChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}
// 分配职位确定按钮的回调
const confirmClick = async () => {
//   收集参数
  let data = {
    userId: userParams.id,
    roleIdList: userRole.value.map(item => item.id)
  }
  // 发送请求
  const result = await reqSerUserRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配成功！'
    })
    await getHasUser(pageNo.value)
    //   关闭抽屉
    drawer1.value = false
  } else {
    ElMessage({
      type: 'error',
      message: '分配失败！'
    })
  }
}
// 删除某一个用户
const deleteUser = async (userId: number) => {
  const result = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功！'
    })
    //   重新获取数据
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败！'
    })
  }
}
// 复选框勾选的时候执行
const selectChange = (val: any) => {
  selectUser.value = val
}
// 批量删除的user回调
const removeSelectUser = async () => {
  //整理批量删除的参数
  let idsList = selectUser.value.map(item => {
    return item.id
  })
  // 批量删除的请求
  const result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功！'
    })
    //   重新获取数据
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'success',
      message: '批量删除失败！'
    })
  }
}
// 搜索按钮的回调
const search = () => {
  // 重新获取数据
  getHasUser()
//   将关键字清空
  keyword.value = ''
}
// 重置按钮的回掉
const reset = () => {
  layOutSettingStore.refresh = !layOutSettingStore.refresh
}
</script>

<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="from">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="keyword?false:true" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button type="danger" :disabled="selectUser.length>0?false:true" @click="removeSelectUser">批量删除</el-button>
    <!--table展示用户信息-->
    <el-table @selection-change="selectChange" border style="margin: 10px 0" :data="userArr">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="=id" width="80"></el-table-column>
      <el-table-column label="用户名字" show-overflow-tooltip align="center" prop="username"></el-table-column>
      <el-table-column label="用户名称" show-overflow-tooltip align="center" prop="name"></el-table-column>
      <el-table-column label="用户角色" show-overflow-tooltip align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" show-overflow-tooltip align="center" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" show-overflow-tooltip align="center" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template #="{row,$index}">
          <el-button type="primary" size="small" :icon="UserFilled" @click="setRole(row)">分配角色</el-button>
          <el-button type="success" size="small" :icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.username}吗？`" width="200" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="danger" size="small" :icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout=" prev, pager, next, jumper,->,sizes, total,"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
  <!--抽屉结构:添加、修改角色-->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="ruleFormRef">
        <el-form-item label="用户的姓名" prop="username">
          <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户的昵称" prop="name">
          <el-input placeholder="请输入用户的昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户的密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请输入用户的密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!--抽屉结构:分配角色-->
  <el-drawer v-model="drawer1" :direction="direction">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>

          <el-checkbox-group v-model="userRole" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRole" :key="role.id" :label="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1=false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.from {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>