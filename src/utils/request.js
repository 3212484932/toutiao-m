/**
 * 请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '../router'

// 在非组件中获取 token 必须使用这种方式
// 这里单独加载 store 和 模块中的 this.$store 一种的
import store from '../store/index.js'

const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn', // 基准路径
  transformResponse: [
    function(data) {
      // 后端返回的数据可能不是JSON格式 字符串
      // 如果不是的话 那么JSONbig.parse 调用的话就会报错
      // 所有我们使用 try-catch 来捕获异常 处理异常的发生
      try {
        // 如果转化成功，直接将结果返回
        return JSONbig.parse(data)
      } catch (err) {
        console.log('转化失败', err)
        // 如果转化失败的则进入这里
        // 我们把数据原封不动的返回给请求调用使用
        return data
      }

      // axios 默认在内部使用 JSON.parse 来转化处理原始数据
      // return JSON.parse(data)
    }
  ]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // console.log(123)
    const { user } = store.state
    // 如果用户登录 统一设置token信息
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
// 响应拦截器
// Add a response interceptor
request.interceptors.response.use(
  function(response) {
    // 响应成功进入这里
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function(error) {
    // 响应失败进入这里
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // 任何超过 2xx 的状态码都会进入这里
    // Do something with response error
    const status = error.response.status

    if (status === 400) {
      // 客户端请求参数异常
      Toast.fail('客户端请求参数异常')
    } else if (status === 401) {
      // token 无效
      // 如果没有user 或 user.token 直接去登录
      const { user } = store.state
      if (!user || !user.token) {
        // 直接跳转到登录页
        return redirectLogin()
      }
      // 如果有 refresh_token 则请求获取新的token
      try {
        const { data } = await refreshTokenReq({
          method: 'PUT',
          url: '/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 拿到新的 token 之后把它更新到容器中
        user.token = data.data.token
        store.commit('setUser', user)
        // 把失败的请求发送出去
        // error.config 是本次请求的相关配置信息对象
        // 这里使用request发送请求 他会走自己的拦截器
        // 他的请求拦截器中通过 store 容器 访问 token容器 数据
        return request(error.config)
      } catch (err) {
        redirectLogin()
      }
      // 拿到新的token后将它更新到容器中
      // 把失败的请求重新发出去
    } else if (status === 403) {
      // 没有操作权限
      Toast.fail('没有操作权限')
    } else if (status >= 500) {
      // 服务端异常
      Toast.fail('服务端异常，请稍后重试')
    }
    // 抛出异常
    return Promise.reject(error)
  }
)
// 跳转到登录页函数方法
function redirectLogin() {
  router.replace({
    name: 'login',
    // 传递查询参数，查询参数会以 ？ 作为分隔符放到 url 后面
    query: {
      // 数据名是 自己起的
      // router.currentRouter 和我们在组件中获取的 this.$router 是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

// 导出
export default request
