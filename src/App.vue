<template>
  <div id="app">
    <!-- 一级占位路由 -->
    <!-- 组件缓存 keep-alive 可以在跳转到下一个页面的时候
    自动缓冲上一个页面的数据 是vue中提供的一个 缓存组件
    参考文档：https://cn.vuejs.org/v2/guide/components-dynamic-async.html
    缓存会出现的正常的问题 ：1. 首先生命周期函数 created 不会再去触发 详情页 在跳转后 始终显示第一次打开的内容
                           2. 页面滚动状态会发生变化
     -->
    <keep-alive :include="cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less"></style>
