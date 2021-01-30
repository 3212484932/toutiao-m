/**
 * 请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

// 在非组件中获取 token 必须使用这种方式
// 这里单独加载 store 和 模块中的 this.$store 一种的
import store from '../store/index.js'

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

export default request
