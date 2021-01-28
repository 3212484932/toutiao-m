/**
 * 请求模块
 */
import axios from 'axios'

// 在非组件中获取 token 必须使用这种方式
// 这里单独加载 store 和 模块中的 this.$store 一种的
import store from '../store/index.js'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn' // 基准路径
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
