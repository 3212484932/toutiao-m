<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestions"
      :key="index"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="hightLight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '../../../api/search'
// 函数的防抖与节流的插件第三方包
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  data() {
    return {
      // 获得联想建议列表
      suggestions: []
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  created() {},
  mounted() {},
  // watch 的使用 具体参考： https://cn.vuejs.org/v2/api/#watch
  watch: {
    // 属性名： 要监视的数据名称
    // searchText() {
    //   console.log('123')
    // },
    // 监听函数的完整写法
    searchText: {
      // 完整的handler方法
      // 使用lodash 第三方插件 中的debounce 函数 进行防抖操作
      // debounce 函数
      // 参数1： 函数
      // 参数2： 时间
      // 返回值：防抖处理函数
      handler: debounce(async function() {
        const { data: res } = await getSearchSuggestions(this.searchText)
        this.suggestions = res.data.options
      }, 300),
      // 当数据发生变化时会执行handler函数
      // async handler() {
      //   // 发送获取联想建议的请求
      //   const { data: res } = await getSearchSuggestions(this.searchText)

      //   this.suggestions = res.data.options
      //   // console.log(res)

      //   console.log('hello')
      // },
      // 该回调将会在监听开始之后立即被调用
      immediate: true
    }
  },
  methods: {
    // 让搜索内容高亮函数
    hightLight(item) {
      // 正则表达式 /中间内容/gi       g:表示全局搜索 i：表示不区分大小写
      // 中间的内容在这种写法中都会被当做中间的内容来对待
      // 错误的写法 /this.searchText/gi
      // RegExp 是正则表达式的构造函数
      // 参数1：字符串
      // 参数2：匹配模式
      // 返回值：正则对象
      return item.replace(
        new RegExp(this.searchText, 'gi'),
        `<span style="color: red;">${this.searchText}</span>`
      )
    }
  }
}
</script>

<style scoped lang="less"></style>
