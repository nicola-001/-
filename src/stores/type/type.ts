import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'

export interface UserState {
  token: string | null,
  menuRoutes: RouteRecordRaw[],
  username: string,
  avatar: string
}

