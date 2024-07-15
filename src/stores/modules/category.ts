import { defineStore } from 'pinia'
import { reqc1, reqc2, reqc3 } from '@/api/product/attr'
import type { CategoryResponseDate } from '@/api/product/attr/type'

const useCategoryStore = defineStore('Category', {
  state: (): any => {
    return {
      // 存储一级分类的数据
      c1Arr: [],
      // 存数一级分类的id
      c1Id: '',
      // 存储二级分类的数据
      c2Arr: [],
      // 存数二级分类的id
      c2Id: '',
      // 存储三级分类的数据
      c3Arr: [],
      // 存数三级分类的id
      c3Id: ''

    }
  },
  actions: {
    // 获取一级分类的数据
    async getc1() {
      const result: CategoryResponseDate = await reqc1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    // 获取二级分类的数据
    async getc2() {
      const result = await reqc2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    //  获取三级分类的数据
    async getc3() {
      const result = await reqc3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    }
  },
  getters: {}
})
export default useCategoryStore