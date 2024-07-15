// 关于layout组件相关配置
import { defineStore } from 'pinia'

const useLayOutSettingStore = defineStore('settingStore', {
  state: () => {
    return {
      fold: false,//用来控制菜单是否折叠
      refresh:true
    }
  }
})
export default useLayOutSettingStore