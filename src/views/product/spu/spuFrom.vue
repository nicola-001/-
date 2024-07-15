<script setup lang="ts">
//子组建通知父组件切换场景
import type {
  AllTrademark,
  HasSaleAttrResponseData,
  SaleAttrResponDate,
  SpuHasImg
} from '@/api/product/spu/type'
import { reqAddOrUpdateSpu, reqAllAttr, reqAllTrademark, reqSpuHassaleAttrList, reqSpuImgList } from '@/api/product/spu'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
// 定义存储已有的SPU数据变量
let AllTradeMark = ref<any>([])
let imgList = ref<any>([])
let saleAttr = ref<any>([])
let allSaleAttr = ref<any>([])
let $emit = defineEmits(['changeScene'])
// 存储已有的spu对象
let SpuParams = ref({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: []
})
// 定义照片墙预览展示与隐藏
const dialogVisible = ref<boolean>(false)
// 存储照片墙地址
const dialogImageUrl = ref<string>('')
// 收集还未选择的销售属性id与属性值的名字
let saleAttrIdAndValueName = ref('')
//取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
// 子组建创建一个方法
const initHasSpuData = async (spu: any) => {
  SpuParams.value = spu
  // 获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark()
  // 获取某个商品下的全部售卖商品图片的数据
  let result1: SpuHasImg = await reqSpuImgList(spu.id)
  //获取某个SPU下的全部已有销售属性接口地址
  let result2: SaleAttrResponDate = await reqSpuHassaleAttrList(spu.id)
  //获取全部销售属性
  let result3: HasSaleAttrResponseData = await reqAllAttr()

  // 存储已有的数据
  AllTradeMark.value = result.data
  imgList.value = result1.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  saleAttr.value = result2.data
  allSaleAttr.value = result3.data
}
const initAddSpu = async (c3Id: any) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
  })
  // 清空照片墙
  imgList.value = []
  // 清空销售属性
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  SpuParams.value.category3Id = c3Id
  // 获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark()
  //获取全部销售属性
  let result1: HasSaleAttrResponseData = await reqAllAttr()
  //存储数据
  AllTradeMark.value = result.data
  allSaleAttr.value = result1.data

}
defineExpose({ initHasSpuData, initAddSpu })
// 点击列表预览的钩子
const handlePictureCardPreview = (file: any) => {
  // 展示遮罩层
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}
// 删除图片墙的钩子
const handleRemove = () => {
  console.log('删除')
}
// 照片墙上传图片成功之前的钩子->约束图片大小，图片类型
const handlerUpload = (file: any) => {
  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件类型必须为小于3M'
      })
      return false
    }

  } else {
    ElMessage({
      type: 'error',
      message: '上传文件类型必须为png、jpeg、gif'
    })
    return false
  }
}

// 计算出当前spu还未选择的销售属性
let unSelectSaleAttr = computed(() => {
  // allSaleAttr 版本 颜色 尺码
  // item 版本 颜色
  let unSelectAttr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectAttr
})
// 添加销售的属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
//   准备一个新的销售属性对象
  let newSaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
//  追加到数组中
  saleAttr.value.push(newSaleAttr)
//   清空收集的数据
  saleAttrIdAndValueName.value = ''
}
// 去编辑
const toEdit = (row: any) => {
  // 显示input
  row.flag = true
  //收集销售属性值
  row.saleAttrValue = ''
}
// 去查看
const toLook = (row: any) => {
  // 整理的属性id  属性名字
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue
  }
//   非法情况判断:判断不能为空
  if (saleAttrValue.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空！'
    })
    return
  }
//   判断属性值是否在数组中存在
  let repeat = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复！'
    })
    return
  }
//   追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
//   切换为查看模式
  row.flag = false
}
// 保存按钮
const save = async () => {
  //1:照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,//图片的名字
      imgUrl: (item.response && item.response.data) || item.url
    }
  })
  //2:整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
    //通知父组件切换场景为0
    $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
  } else {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
  }

}
</script>

<template>
  <el-form label-width="80px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName" />
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 230px" v-model="SpuParams.tmId">
        <el-option v-for="item in AllTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select v-model="saleAttrIdAndValueName" style="width: 200px"
                 :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'">
        <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"
                   :label="item.name"></el-option>
      </el-select>
      <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin:10px"
                 type="primary" size="default" icon="Plus">添加属性
      </el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin:10px 0px" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row:即为当前SPU已有的销售属性对象 -->
          <template #="{ row, $index }">
            <el-tag style="margin:0px 5px" @close="row.spuSaleAttrValueList.splice(index, 1)"
                    v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable>
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true"
                      placeholder="请你输入属性值" size="small" style="width:100px"></el-input>
            <el-button @click="toEdit(row)" v-else type="primary" size="small" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Delete"
                       @click="saleAttr.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="saleAttr.length>0?false:true" type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>