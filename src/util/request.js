import axios from 'axios'
import router from '../router'
// 创建axios实例
export const service = axios.create({
  timeout: 30000 // 请求超时时间
})
// 添加request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  Promise.reject(error)
})
// 添加respone拦截器
service.interceptors.response.use(
  response => {
    let res = {}
    res.status = response.status
    res.data = response.data
    return res
  },
  error => {
    if (error.response && error.response.status === 404) {
      router.push('/blank.vue')
    }
    return Promise.reject(error.response)
  }
)
export function get (url, params = {}) {
  // get方法加一个时间参数,解决ie下可能缓存问题.
  params.t = new Date().getTime()
  return service({
    url: '/api' + url,
    method: 'get',
    headers: {
    },
    params
  })
}
// 封装post请求
export function post (url, data = {}) {
  // 默认配置
  let sendObject = {
    url: '/api' + url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  }
  sendObject.data = JSON.stringify(data)
  return service(sendObject)
}
// 封装put方法 (resfulAPI常用)
export function put (url, data = {}) {
  return service({
    url: '/api' + url,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data)
  })
}
// 删除方法(resfulAPI常用)
export function deletes (url) {
  return service({
    url: '/api' + url,
    method: 'delete',
    headers: {}
  })
}
// 不要忘记export export {
//   service
// }
