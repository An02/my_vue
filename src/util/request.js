import axios from 'axios'
import qs from 'qs'
// import { getDynamicUrl, cookies, browserUtils, getUrlParam } from '@/utils'
const baseUrl = '/api/'
export const request = (url, body, type = 'get', isJson = true, baseUrlRewrite) => {
  const query = {
    url: `${baseUrl}${url}`,
    method: type,
    withCredentials: true,
    timeout: 30000
  }
  if (type === 'get') {
    query.params = body
  } else {
    query.data = isJson ? body : qs.stringify(body)
    query.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  return axiosRequest(query)
}

export const axiosRequest = (query) => {
  return axios.request(query)
    .then(res => {
      return new Promise((resolve, reject) => {
        if (!res.data) {
          reject(new Error('服务器响应超时'))
          return
        }
        if (res.data.status === 1) {
          resolve(res.data)
        } else {
          res.data.message = res.data.msg
          reject(res.data)
        }
      })
    }, e => {
      console.log(e.response)
      if (e.response !== undefined) {
        switch (e.response.status) {
          case 401: // 未登录跳转至登录页
            /* if (cookies.getCookie('ucarincLogoutUrl')) {
              const ucarincLogoutUrl = cookies.getCookie('ucarincLogoutUrl')
              top.location.href = ucarincLogoutUrl
              cookies.delCookie('ucarincLogoutUrl')
            } else {
              top.window.postMessage({
                type: 'NO_LOGIN',
                msg: '401'
              }, '*')
              // SSO
              let clientUrl = getUrlParam('clientUrl')
              if (clientUrl) {
                top.location.assign(getDynamicUrl('//ampadminuc.ucarinc.com/#/login?clientUrl=' + clientUrl))
              } else {
                top.location.assign(getDynamicUrl('//ampadminuc.ucarinc.com/#/login'))
              }
              if (browserUtils.getBrowser() === 'IE') {
                vue.prototype.$message.error('登录超时，请重新登录')
                setTimeout(() => {
                  top.location.reload()
                }, 800)
                return
              }
            } */
            return Promise.reject(new Error('登录超时，请重新登录'))
          case 403: // 无权限操作
            top.window.postMessage({
              type: 'NO_PERMISSION',
              msg: '403'
            }, '*')
            return Promise.reject(new Error('无权访问此资源'))
          default:
            if (e.response.data && e.response.data.msg) {
              return Promise.reject(new Error(e.response.data.msg))
            }
            break
        }
      }
      return Promise.reject(e.response)
    })
    .catch(e => {
      this.$message.error(e && e.message ? e.message : '系统错误')
      return Promise.reject(e)
    })
}
