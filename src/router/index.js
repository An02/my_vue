import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import USER from './test_module'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/user',
      name: '新车发票管理',
      component: {template: '<router-view />'},
      children: USER
    }
  ]
})
