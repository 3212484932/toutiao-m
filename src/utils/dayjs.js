/**
 * 初始化 dayjs 相关的配置
 */

// 引入 vue
import Vue from 'vue'

// 引入 dayjs 插件
import dayjs from 'dayjs'
// 加载语言包插件
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间
dayjs.extend(relativeTime)

// 全局使用 配置使用中文语言包
dayjs.locale('zh-cn')

// 把处理相对时间的代码封装为全局过滤器
// 然后就可以在任何组件模板中使用了
// 所谓的过滤器其实就是一个可以在末班中调用的函数而已
// 在组件模板中使用过滤器： {{ xxx | relativeTime }}
// 管道符前面的内容会作为参数传递到过滤器函数
// 过滤器的返回值会渲染到使用过滤器的模板中
Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})

// dayjs().format()
// 测试组件
// console.log(dayjs('2021-1-26').from(dayjs()))
