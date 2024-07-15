import { createRouter, createWebHashHistory} from 'vue-router'
import {constentRoute} from '@/router/routes'

const router = createRouter({
  history:createWebHashHistory(),
  routes: constentRoute
})
export default router