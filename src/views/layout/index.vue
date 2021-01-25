<template>
  <div class="layout-container">
    <!-- 子路由的出口 -->
    <router-view />
    <!-- /子路由的出口 -->

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active">
      <van-tabbar-item icon-prefix="icon" icon="shouye">首页</van-tabbar-item>
      <van-tabbar-item icon-prefix="icon" icon="wenda">问答</van-tabbar-item>
      <van-tabbar-item icon-prefix="icon" icon="shipin">视频</van-tabbar-item>
      <van-tabbar-item icon-prefix="icon" icon="wode">我的</van-tabbar-item>
    </van-tabbar>
    <!-- /底部导航栏 -->
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      active: 0
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
