<template>
  <div class="layout-container">
    <!-- 子路由的出口 -->
    <!-- <keep-alive> -->
    <router-view />
    <!-- </keep-alive> -->
    <!-- /子路由的出口 -->

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon-prefix="icon" to="/" icon="shouye"
        >首页</van-tabbar-item
      >
      <van-tabbar-item icon-prefix="icon" to="/qa" icon="wenda"
        >问答</van-tabbar-item
      >
      <van-tabbar-item icon-prefix="icon" to="/video" icon="shipin"
        >视频</van-tabbar-item
      >
      <van-tabbar-item icon-prefix="icon" to="/my" icon="wode"
        >我的</van-tabbar-item
      >
    </van-tabbar>
    <!-- /底部导航栏 -->
  </div>
</template>

<script>
// import { api } from '../../api/user.js'

export default {
  name: 'LayoutIndex',
  data() {
    return {
      active: 0
    }
  },
  created() {
    // this.getMenuList()
  },
  mounted() {
    this.$store.commit('addCachePage', 'LayoutIndex')
  },
  methods: {
    // 获取所有放入接口
    // async getMenuList() {
    //   const { data: res } = await api()
    //   console.log(res)
    // }
  }
}
</script>

<style scoped lang="less"></style>
