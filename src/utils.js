export const recursion = (array, key, value, childKey) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) return array[i]
    if (array[i][childKey] && array[i][childKey] instanceof Array && array[i][childKey].length > 0) {
      let result = recursion(array[i][childKey], key, value, childKey)
      if (result) return result
    }
  }
  return null
}
export const cookies = {
  // 设置cookie
  setCookie: (cName, value, expiredays) => {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = cName + '=' + escape(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
  },
  // 获取cookie
  getCookie: (name) => {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    let arr = document.cookie.match(reg)
    if (arr) {
      return unescape(arr[2])
    } else {
      return null
    }
  },
  // 删除cookie
  delCookie: (name) => {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = cookies.getCookie(name)
    if (cval !== null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
}

export const browserUtils = {
  getBrowser: () => {
    var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf('Opera') > -1
    if (isOpera) {
      return 'Opera'
    }; // 判断是否Opera浏览器
    if (userAgent.indexOf('Firefox') > -1) {
      return 'FF'
    } // 判断是否Firefox浏览器
    if (userAgent.indexOf('Chrome') > -1) {
      return 'Chrome'
    }
    if (userAgent.indexOf('Safari') > -1) {
      return 'Safari'
    } // 判断是否Safari浏览器
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      return 'IE'
    } // 判断是否IE浏览器
    if (userAgent.indexOf('Trident') > -1) {
      return 'IE'
    } // 判断是否IE浏览器
  }
}

export const passwordUtils = {
  // 校验密码
  checkPassword: (passwordStr) => {
    let checkResult = passwordUtils.checkPasswordInternal(passwordStr)
    if (checkResult === 1) {
      return '新密码不合法, 密码长度必须是六位及以上!'
    }
    if (checkResult === 2) {
      return '新密码不合法, 密码必须含有大、小写字母、数字或特殊字符（如@#￥%），且至少包含其中三种'
    }
    return ''
  },
  checkPasswordInternal (pass) {
    if (pass.length < 6) {
      return 1
    }
    let ls = 0
    if (pass.match(/([a-z])+/)) {
      ls++
    }
    if (pass.match(/([0-9])+/)) {
      ls++
    }
    if (pass.match(/([A-Z])+/)) {
      ls++
    }
    if (pass.match(/[^a-zA-Z0-9]+/)) {
      ls++
    }
    return ls < 3 ? 2 : 0
  }
}

export const mixin = (obj) => {
  const base = {
    data () {
      return {
        $ucarConfig: {
          autoClose: false,
          openerCallBack: ''
        }
      }
    },
    computed: {
      userPermissions () {
        return this.$store.getters.permissions
      }
    },
    methods: {
      registryVm () {
        window.$currentVm = this
      },
      pageOver () {
        const timer = arguments[arguments.length - 1] &&
        typeof arguments[arguments.length - 1] === 'number' ? arguments[arguments.length - 1] : 1000
        const opener = window.opener
        if (!opener) return
        const {autoClose, openerCallBack} = this.$data.$ucarConfig
        if (openerCallBack &&
          typeof opener.$currentVm[openerCallBack] === 'function') {
          opener.$currentVm[openerCallBack](...arguments)
        }
        if (autoClose === true) {
          setTimeout(() => {
            window.close()
          }, timer)
        }
      },
      callNewPage (url, options = {}) {
        if (!options.autoClose) options.autoClose = true
        let path = /\/$/.test(url) ? url : `${url}/`
        const target = /^(http|https):\/\//.test(path) ? url
          : `/#${url}`
        let queryStr = `?timestamp=${new Date().getTime()}&iframeType=iframeType`
        for (let key in options) {
          queryStr += `&${key}=${options[key]}`
        }
        window.open(`${target}${queryStr}`, options.pageName)
      },
      setPageTitle (title) {
        document.title = title || '页面名字'
        window.addEventListener('hashchange', () => {
          document.location.reload()
        })
      }
    },
    mounted () {
      this.$data.$ucarConfig.autoClose = !!this.$route.query.autoClose
      this.$data.$ucarConfig.openerCallBack = this.$route.query.callback
      this.registryVm()
    },
    beforeRouteUpdate () {
      this.registryVm()
    }
  }
  if (obj.mixins) {
    obj.mixins.push(base)
  } else {
    obj.mixins = [base]
  }
  return obj
}

export const getCurrEnvContext = () => {
  let env = ''
  switch (window.runtime_env) {
    case 'development':
      env = '开发环境'
      break
    case 'test':
      env = '测试一环境'
      break
    case 'test2':
      env = '测试二环境'
      break
    case 'test3':
      env = '测试三环境'
      break
    case 'preProduct':
      env = '预生产环境'
      break
    case 'product':
      env = ''
      break
    default:
      env = ''
  }
  return env
}
export const getDynamicUrl = url => {
  const envMap = {
    development: 'dev',
    test: 'test',
    test2: 'test2',
    test3: 'test3',
    preProduct: 'pre',
    product: ''
  }

  if (!window.runtime_env) return url
  if (window.fe_url) {
    return url.replace('ampcats.ucarinc.com', `${window.fe_url}:${window.fe_port}`)
  }
  return url.replace(/(.+)\.ucarinc.com/, `$1${envMap[window.runtime_env]}.ucarinc.com`)
}

export const getUrlParam = paraName => {
  let url = document.location.toString()
  let arrObj = url.split('?')
  if (arrObj.length > 1) {
    let arrPara = arrObj[1].split('&')
    let arr
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=')
      if (arr != null && arr[0] === paraName) {
        return arr[1]
      }
    }
    return ''
  } else {
    return ''
  }
}
export const getBackEndUrl = url => {
  const envMap = {
    development: 'dev',
    test: 'test',
    test2: 'test2',
    test3: 'test3',
    preProduct: 'pre',
    product: ''
  }

  if (!window.runtime_env) return url
  if (window.fe_url) {
    return url.replace('ampvms.ucarinc.com', `${window.fe_url}`)
  }
  return url.replace(/(.+)\.ucarinc.com/, `$1${envMap[window.runtime_env]}.ucarinc.com`)
}
