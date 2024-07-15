<script lang="ts">
export default {
  name: 'rolePage'
}
</script>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqAddOrUpdateRole, reqAllPermission, reqAllRole, reqDeleteRole, reqSetPermission } from '@/api/acl/role'
import { Delete, Edit, UserFilled } from '@element-plus/icons-vue'
import useLayOutSettingStore from '@/stores/modules/setting'
import { ElMessage } from 'element-plus'
//默认展示第几页的数据
let pageNo = ref<number>(1)
// 一页有几条数据
let pageSize = ref<number>(10)
// 定义变量用于存储返回来的数据
let AllRecords = ref([])
// 返回来的数据总数量
let total = ref<number>(0)
// 定义关键字用于收集用户输入的参数
let keyword = ref('')
// 引入仓库中的reset方法，编写重置按钮
let layOutSettingStore = useLayOutSettingStore()
// 控制对话框的显示与隐藏
const dialogVisible = ref(false)
// 收集添加职位的数据
let RoleParams = reactive({
  roleName: '',
  id: 0
})
// 获取from组建实例
let from = ref<any>()
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 定义用于收集权限管理的数据
let menuArr = ref<any>([])
// 准备一个数组：用于存储勾选节点的id(四级id)
let selectArr = ref<any>([])
//树形控件的标识
const tree = ref<any>()
onMounted(() => {
  getAllRole()
})
// 获取全部职位的接口
const getAllRole = async (pager = 1) => {
  pageNo.value = pager
  const result = await reqAllRole(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    AllRecords.value = result.data.records
    total.value = result.data.total
  }
}
// 分页器修改每页展示几条数据的回调-下拉菜单的回调
const handler = () => {
  getAllRole()
}
// 搜索按钮的回调
const search = () => {
  getAllRole()
//   清空输入框的数据
  keyword.value = ''
}
// 重置按钮的回调
const reset = () => {
  layOutSettingStore.refresh = !layOutSettingStore.refresh
}
// 添加职位的回调
const addRole = () => {
  //  对话框显示
  dialogVisible.value = true
  // 清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0
  })
//  清空表单校验结果
  nextTick(() => {
    from.value.clearValidate('roleName')
  })
}
// 更新职位按钮的回调
const updateRole = (row: any) => {
  //  对话框显示
  dialogVisible.value = true
  //存储已有的职位
  Object.assign(RoleParams, row)
  //  清空表单校验结果
  nextTick(() => {
    from.value.clearValidate('roleName')
  })
}
const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('职位名称至少2个字符'))
  }
}
// 表单校验功能
const rules = {
  roleName: [
    { required: true, trigger: 'blur', validator: validateRoleName }
  ]
}
// 确定按钮的回调
const save = async () => {
  await from.value.validate
  const result = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功'
    })
    //   重新获取数据
    await getAllRole(RoleParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: RoleParams.id ? '更新失败' : '添加失败'
    })
  }
  // 关闭对话框
  dialogVisible.value = false
}
// 设置权限
const setPremission = async (roleId: number) => {
  const result = await reqAllPermission(roleId)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
  //打开抽屉
  drawer.value = true
}
// 树形控件
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 递归生成 树形控件是否勾选的数组
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.lenth > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
}
// 抽屉的确定按钮
const handlerTree = async () => {
//   职位id
  const roleId = RoleParams.id
//    获取树形控件的勾选节点
  let arr = tree.value.getCheckedKeys()
  let arr1 = tree.value.getHalfCheckedKeys()
  // 合并id参数
  let permissionId = arr.concat(arr1)
  const result: any = await reqSetPermission(roleId, permissionId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '设置成功'
    })
    // 关闭抽屉
    drawer.value = false
    //   刷新功能
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '设置失败'
    })
  }
}
// 删除角色
const deletePermission = async (id: number) => {
  const result: any = await reqDeleteRole(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 重新获取数据
    getAllRole(pageNo.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>

<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="from">
      <el-form-item label="职位名称">
        <el-input placeholder="职位名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="keyword?false:true" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addRole">添加职位</el-button>
    <el-table style="margin: 10px 0" border :data="AllRecords">
      <el-table-column label="#" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="id" align="center" width="150px" prop="id"></el-table-column>
      <el-table-column label="职位名称" align="center" width="120px" prop="roleName"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" width="120px" prop="createTime"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" width="120px" prop="updateTime"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template #default="{row,$index}">
          <el-button type="primary" size="small" :icon="UserFilled" @click="setPremission(row.id)">分配权限</el-button>
          <el-button type="warning" size="small" :icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.roleName}吗？`" width="250" @confirm="deletePermission(row.id)">
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
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="total"
      @current-change="getAllRole"
      @size-change="handler"
    />
  </el-card>
  <!--添加结构与修改已有结构的对话框-->
  <el-dialog
    v-model="dialogVisible"
    :title="RoleParams.id?'更新职位':'添加职位'"
    width="500"
  >
    <el-form :model="RoleParams" :rules="rules" ref="from">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
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
  <!--抽屉组件-分配菜单权限与按钮权限-->
  <el-drawer v-model="drawer" :direction="direction">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!--树形控件-->
      <el-tree ref="tree"
               style="max-width: 600px"
               :data="menuArr"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="selectArr"
               :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer=false">取消</el-button>
        <el-button type="primary" @click="handlerTree">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.from {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>