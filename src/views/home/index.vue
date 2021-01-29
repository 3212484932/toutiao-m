<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        round
        slot="title"
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 文章频道列表 -->
    <van-tabs v-model="active" class="channels_list">
      <van-tab :title="item.name" v-for="item in channelsList" :key="item.id">
        <!-- 文章列表 -->
        <article-list :channels="item" />
        <!-- /文章列表 -->
      </van-tab>
      <div slot="nav-right" class="nav-warp-placeholder"></div>
      <!-- 更换列表模块 -->
      <div class="channelsBtn-warp" @click="isChannelsEditShow = true">
        <van-icon class="icon-nav" name="wap-nav" />
      </div>
      <!-- /更换列表模块 -->
    </van-tabs>
    <!-- /文章频道列表 -->
    <!-- 弹出修改列表层 -->
    <van-popup
      v-model="isChannelsEditShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      round
      close-icon-position="top-left"
      get-container="body"
    >
      <!-- 展示频道列表组件 -->
      <channels-edit
        :userChannels="channelsList"
        :active="active"
        @closed="isChannelsEditShow = false"
        @updata-channel="active = $event"
      />
    </van-popup>
    <!-- /弹出修改列表层 -->
  </div>
</template>

<script>
import { getUserChannels } from '../../api/user.js'
import ArticleList from './components/article-list'
import ChannelsEdit from './components/channels-edit'
import { mapState } from 'vuex'
import { getItem } from '../../utils/storage.js'

export default {
  name: 'homeIndex',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ArticleList,
    ChannelsEdit
  },
  data() {
    return {
      // 监听列表滚动
      active: 0,
      // 承接列表数据
      channelsList: [],
      // 控制弹出层显示与隐藏
      isChannelsEditShow: false
    }
  },
  created() {
    this.loadingChannels()
  },
  mounted() {},
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 获取列表
    async loadingChannels() {
      let channels = []
      if (this.user) {
        // 已登录 请求获取线上的用户频道数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录 判断是否有本地储存
        const localChannels = getItem('user-channels')

        // 如果 有本地储存 就将本地存储赋值给 channels
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有登录 也没有本地存储 就请求默认的请求接口
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }

      this.channelsList = channels
      // const { data } = await getUserChannels()
      // // console.log(data.data.channels)
      // this.channelsList = data.data.channels
    }
    // 跳转到对应的模块
    // onUpdataChannel(index) {
    //   console.log(index)
    //   this.active = index
    // }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/.search-btn {
    width: 277px;
    height: 32px;
    border: none;
    background-color: #5babfb;
    .van-icon {
      color: #fff;
      font-size: 16px;
    }
    .van-button__text {
      color: #fff;
      font-size: 14px;
    }
  }
  /deep/.van-nav-bar__title {
    max-width: none;
  }
  .channels_list {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
      bottom: 20px;
    }
  }
  .channelsBtn-warp {
    position: absolute;
    top: 0;
    right: 0;
    height: 42px;
    line-height: 48px;
    padding: 0 9px;
    background-color: #fff;
    opacity: 0.9;
    .icon-nav {
      padding-top: 1px;
      color: #333;
    }
    &::before {
      content: '';
      width: 1px;
      height: 43px;
      background: url('./nav-warp.png');
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
    }
  }
  .nav-warp-placeholder {
    width: 42px;
    flex-shrink: 0;
  }
}
</style>
