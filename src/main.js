import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载图标组件
import './styles/icon.less'

// 引入vant组件库
import Vant from 'vant'
// 引入vant 样式
import 'vant/lib/index.css'

// 自动设置 REM 基准值 （html 字体大小）
import 'amfe-flexible'

// 加载全局样式文件 (一般将项目中的全局样式放在加载的最后面 用于覆盖前面的样式)
import './styles/index.less'

// 全局注册 vant中的组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
