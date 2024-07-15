<script setup lang="ts">
import useCategoryStore from '@/stores/modules/category'
import { nextTick, onBeforeMount, reactive, ref, watch } from 'vue'
import { reqAddOrUpdateAttr, reqAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
// 存储属性值
const attrArr: any = ref([])
// 控制table与 修改的显示
const scene = ref<number>(0) //scren 0显示table； 1显示修改
// 收集新增属性的数据
let attrParams = reactive<any>({
  attrName: '', //新增属性的属性名
  attrValueList: [],//新增的属性值数组
  categoryId: '',//三级分类的id
  categoryLevel: 3  //三级分类
})
// 获取仓库中的数据
const categoryStore = useCategoryStore()
// 存储对应的组件实例el-input
let inputArr = ref<any>([])
// 监听c3Id,如果有该数据就发送请求
watch(() => categoryStore.c3Id, () => {
  // 清空上次的属性与属性值
  attrArr.value = []
  // 确保有c3Id才能发送请求
  if (!categoryStore.c3Id) return
  getAttr()
})
// 封装获取属性与属性值的函数
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}
// 添加属性按钮
const addAttr = () => {
  // 添加数据之后将数据置空
  Object.assign(attrParams, {
    attrName: '', //新增属性的属性名
    attrValueList: [],//新增的属性值数组
    categoryId: categoryStore.c3Id,//三级分类的id
    categoryLevel: 3  //三级分类
  })
  // 收集三级分类的id
  // attrParams.categoryId = categoryStore.c3Id
  // 切换为添加修改
  scene.value = 1
}
// 编辑按钮的回调
const updateAttr = (row: Attr) => {
  scene.value = 1
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 取消按钮的回调
const cancel = () => {
  scene.value = 0
}
// 添加属性值的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候，向数组中添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })
//   让数组的最后一个元素聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 保存按钮的回调
const save = async () => {
  const result: any = await reqAddOrUpdateAttr(attrParams)
  console.log(result)
  if (result.code == 200) {
    // 切换场景
    scene.value = 0
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    // 重新发送请求获取数据
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
}
// 查看
const toLook = (row: AttrValue, $index: number) => {
  // 判断非法情况1
  if (row.valueName.trim() == '') {
    // 删除掉对应属性值为空的情况
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  // 非法情况2
  let repest = attrParams.attrValueList.find((item: any) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repest) {
    // 删除掉对应属性值为空的情况
    attrParams.attrValueList.splice($index, 1)

    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }
  row.flag = false
}
// 编辑
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
// 删除某个已有属性的方法
const deleteAttr = async (attrId: number) => {
  const result: any = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 重新获取数据
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
// 路由跳转清除相关数据
onBeforeMount(() => {
  categoryStore.$reset()
})
</script>

<template>
  <Category :scene="scene" />
  <el-card style="margin: 10px 0">
    <!--table-->
    <div v-show="scene==0">
      <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id?false:true" @click="addAttr">添加属性
      </el-button>
      <el-table border style="margin: 10px 0;" :data="attrArr">
        <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
        <el-table-column label="属性名称" prop="attrName"></el-table-column>
        <el-table-column label="属性值名称">
          <template #default="{row,$index}">
            <el-tag type="success" style="margin: 0 5px" v-for="item in row.attrValueList" :key="item.id">
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row,$index}">
            <el-button type="warning" size="small" icon="edit" @click="updateAttr(row)"></el-button>
            <el-popconfirm icon-color="red" :title="`你确定要删除${row.attrName}吗？`" @confirm="deleteAttr(row.id)"
                           width="230px">
              <template #reference>
                <el-button type="danger" size="small" icon="delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加修改操作-->
    <div v-show="scene==1">
      <el-form :inline="true">
        <el-form-item label="添加属性值">
          <el-input placeholder="请您输入添加的属性值" v-model="attrParams.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="addAttrValue" type="primary" icon="plus" :disabled="attrParams.attrName?false:true">
        添加属性值
      </el-button>
      <el-button @click="cancel">取消</el-button>
      <el-table border style="margin: 20px 0" :data="attrParams.attrValueList">
        <el-table-column label="序号" align="center" type="index"></el-table-column>
        <el-table-column label="属性值名称">
          <template #default="{row,$index}">
            <el-input :ref="(vc:any)=>inputArr[$index]=vc" v-if="row.flag" @blur="toLook(row,$index)"
                      placeholder="请你输入属性值名称" size="small"
                      v-model="row.valueName"></el-input>
            <div v-else @click="toEdit(row,$index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="属性值操作">
          <template #default="{row,$index}">
            <el-button type="danger" icon="delete" size="small"
                       @click="attrParams.attrValueList.splice($index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" :disabled="attrParams.attrValueList.length>0?false:true" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<style scoped>

</style>