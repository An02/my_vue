
const USER = [
  {
    path: '/user/userInfo',
    name: '用户信息',
    component: require('@/page/user/userInfo.vue').default
  },
  {
    path: '/user/main',
    name: 'main页面',
    component: require('@/page/main/main.vue').default
  },
  {
    path: '/user/batch',
    name: '批量页面',
    component: require('@/page/user/batch.vue').default
  },
  {
    path: '/user/batchModel',
    name: '批量页面',
    component: require('@/page/user/batchModel.vue').default
  }
]
export default USER
