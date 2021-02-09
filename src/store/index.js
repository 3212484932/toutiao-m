import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '../utils/storage.js'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY), // 存储当前用户的登录状态 （token等 数据）
    // user: JSON.parse(window.localStorage.getItem('user')) // 存储当前用户的登录状态 （token等 数据）
    cachePages: ['LayoutIndex']
  },
  mutations: {
    setUser(state, data) {
      state.user = data // 将用户登录后的信息 赋值给 vuex 中state中

      setItem(USER_KEY, state.user)
      // 为了放置页面刷新数据丢失，我们还需要把数据放在本地储存中 利用本地存储来保存 token值 仅仅是为了数据的持久化
      // window.localStorage.setItem('user', JSON.stringify(state.user))
    },
    // 添加缓存页面
    addCachePage(state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    // 移除缓存页面
    removeCachePage(state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {},
  modules: {}
})
