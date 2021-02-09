<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      :success-text="isSuccessText"
      success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(item, index) in articleList"
          :key="index"
          :title="item.title"
        /> -->
        <article-item
          :article="item"
          v-for="(item, index) in articleList"
          :key="index"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '../../../api/article.js'
import ArticleItem from '../../../components/article-item'
import { debounce } from 'lodash'
export default {
  name: 'articlesList',
  props: {
    channels: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data() {
    return {
      // 列表
      articleList: [],
      // 下拉事件触发
      loading: false,
      // 下拉事件关闭事件
      finished: false,
      // 传递时间戳
      timestamp: null,
      // 监听事件打开和关闭
      isPullLoading: false,
      // 刷新成功提示文字
      isSuccessText: '',
      // 列表滚动到顶部的距离
      scrollTop: 0
    }
  },
  created() {},
  mounted() {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      // console.log(articleList.scrollTop)
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated() {
    // 打印测试
    console.log('从缓存中被激活')
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  // deactivated() {
  //   console.log('组件失去活动了')
  // },
  methods: {
    // 列表刷新事件
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channels.id, // 频道的 ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的事件数据请求当前的时间戳timestamp 相当于页码，
        // 请求最新的数据使用当前最新的时间戳，下一页数据使用上一次返回的时间戳
        with_top: 1 // 是否包含顶置，进入页面第一次请求时要包含置顶文章，  1 - 包含置顶  0 -  不包含置顶
      })
      // 打印请求数据
      console.log(data)
      // 2. 将数据放到list列表中
      const { results } = data.data
      this.articleList.push(...results)
      // 3. 设置本次加载状态结束，他才可以判断是否需要加载下一次，否则永远停在这里
      this.loading = false
      // 4. 数据全部加载完成
      if (results.length) {
        // 更新状态 获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了 把加载状态设置为结束，不再触发加载更多
        this.finished = true
      }
    },
    // 下拉刷新事件
    async onRefresh() {
      // 1. 发送请求
      const { data } = await getArticles({
        channel_id: this.channels.id, // 频道的 ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的事件数据请求当前的时间戳timestamp 相当于页码，
        // 请求最新的数据使用当前最新的时间戳，下一页数据使用上一次返回的时间戳
        with_top: 1 // 是否包含顶置，进入页面第一次请求时要包含置顶文章，  1 - 包含置顶  0 -  不包含置顶
      })
      console.log(data)
      // 2. 通过接收到的请求 将最新的数据绑定到首页最上方
      const { results } = data.data
      this.articleList.unshift(...results)
      // 3. 刷新完成 关闭触发的下拉事件 并且显示成功提示
      this.isPullLoading = false
      // 提示文字
      this.isSuccessText = `更新新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
