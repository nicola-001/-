<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type'
import { ElMessage, type UploadProps } from 'element-plus'
// 设置分页器当前的页码
let pageNo = ref<number>(1)
// 每页显示的条数
let limit = ref<number>(3)
// 获取返回数据的总条数
let total = ref<number>(0)
// 获取的数据的数组
let trademarkArr = ref<Records>([])
// 控制弹出框的显示隐藏
const dialogFormVisible = ref(false)

// 定义收集新增品牌的数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
// 获取el-from组件实例
let fromRef = ref()

// 封装获取已有品牌的数据
const getTrademark = async (pager = 1) => {
  pageNo.value = pager
  const result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
onMounted(() => {
  getTrademark()
})

// 当下拉菜单发生变化的时候  触发此函数
const sizeChange = () => {
  getTrademark()
}
// 添加品牌操作
const addTradeMark = () => {
  // 显示弹出框
  dialogFormVisible.value = true
  // 将数据清空
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
//   清除上次遗留下来的表单校验结果  ：由于还没有渲染dom所以不能直接调用该方法
  // 方法一：用ts的语法特性
  fromRef.value?.clearValidate('tmName')
  fromRef.value?.clearValidate('logoUrl')
  //方法二: 等待下一次 DOM 更新刷新的工具方法。
  // nextTick(() => {
  //   fromRef.value.clearValidate('tmName'),
  //     fromRef.value.clearValidate('logoUrl')
  // })
}

// 修改品牌操作
const updateTradeMark = (row: TradeMark) => {
  nextTick(() => {
    fromRef.value.clearValidate('tmName'),
      fromRef.value.clearValidate('logoUrl')
  })
  // 显示弹出框
  dialogFormVisible.value = true
  // es6语法中合并参数
  Object.assign(trademarkParams, row)

}
// 确定按钮
const confirm = async () => {
  // 在发送请求之前对所有的表单进行校验
  await fromRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    //  重新获取全部数据
    getTrademark(trademarkParams.id ? pageNo.value : 1)
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    // 关闭弹出框
    dialogFormVisible.value = false
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
    })
    // 关闭显示弹出框
    dialogFormVisible.value = false
  }
}
// 取消按钮
const cancel = () => {
  // 关闭弹出框
  dialogFormVisible.value = false
}
// 上传图片之前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type == 'image/jpeg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小必须小于4M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件类型必须是png,jpg,gif'
    })
    return false
  }
}
// 上传图片之后的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // 保存的数据等于返回的数据否则 再次刷新获取不到数据
  trademarkParams.logoUrl = response.data
  //上传完图片之后，清除imgUrl的表单校验结果
  fromRef.value.clearValidate()
}

// 表单验证功能
const validatortmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称位数大于等于两位'))
  }
}
const validatorlogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('必须上传品牌LOGO'))
  }
}
// 定义表单校验的规则
const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validatortmName }
  ],
  logoUrl: [
    { required: true, validator: validatorlogoUrl }
  ]

}
// 删除已有产品
const deleteTrademark = async (id: number) => {
  const result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 再次发送请求，获取全部数据
    getTrademark(trademarkArr.value.length>1?pageNo.value:pageNo.value-1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>
<script lang="ts">
export default {
  name: 'tradeMark'
}
</script>
<template>
  <el-card>
    <!--添加按钮-->
    <el-button type="primary" icon="Plus" @click="addTradeMark">添加品牌</el-button>
    <!--table表格-->
    <el-table border style="margin: 10px 0;" :data="trademarkArr">
      <el-table-column label="序号" :width="'80px'" align="center" type="index"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{row,$index}">
          <img :src="row.logoUrl" style="height: 100px">
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{row,$index}">
          <el-button type="warning" icon="edit" size="small" @click="updateTradeMark(row)"></el-button>
          <el-popconfirm :title="`您确定要删除${row.tmName}吗？`" icon="delete" width="200px" icon-color="red"
                         @confirm="deleteTrademark(row.id)">
            <template #reference>
              <el-button type="danger" icon="delete" size="small"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getTrademark"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background=true
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
    />
    <!--对话框静态组建搭建-->
    <el-dialog v-model="dialogFormVisible" title="添加品牌" width="600px">
      <el-form style="width: 60%" :model="trademarkParams" :rules="rules" ref="fromRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入您的品牌名称" v-model="trademarkParams.tmName" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.el-select-dropdown__item {
  display: block !important; /* 强制块级显示 */
}
</style>