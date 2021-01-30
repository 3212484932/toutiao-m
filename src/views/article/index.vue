<template>
  <div class="article-index">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情页"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <h1 class="title">牛逼程序员都用的开源工具，你用了 几个？</h1>
    <!-- 文章作者信息 -->
    <van-cell center>
      <van-image
        class="avatar"
        slot="icon"
        width="35"
        height="35"
        round
        fit="cover"
        src="https://img01.yzcdn.cn/vant/cat.jpeg"
      />
      <div class="author-name" slot="title">天涯小型客</div>
      <div class="updata-time" slot="label">14小时前</div>
      <van-button
        class="attention-btn"
        type="info"
        icon="plus"
        size="small"
        round
        >关注</van-button
      >
    </van-cell>
    <!-- /文章作者信息 -->
    <!-- 文章内容 -->
    <div class="markdown-body">
      <p>哈哈哈</p>
      <a href="">11111</a>
      <ul>
        <li>woaini</li>
        <li>woaini</li>
        <li>woaini</li>
      </ul>
    </div>
    <!-- /文章内容 -->
  </div>
</template>

<script>
import './githubStyle.css'
import { getArticleById } from '../../api/article'
// 传递文章id的两种方式
// 方式一： 通过 $router.params.articleId
// 方式二： 通过 props传参 （推荐）
export default {
  name: 'ArticleIndex',
  data() {
    return {}
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  created() {
    this.loadingArticle()
  },
  mounted() {},
  methods: {
    // 获取文章详情页
    async loadingArticle() {
      const { data: res } = await getArticleById(this.articleId)
      console.log(res)
    }
  }
}
</script>

<style scoped lang="less">
.article-index {
  .avatar {
    margin-right: 8px;
  }
  .title {
    font-size: 20px;
    padding: 14px;
    background-color: #fff;
    margin: 0;
  }
  .author-name {
    color: #4d4d4d;
    font-size: 12px;
  }
  .updata-time {
    color: #b5b5b5;
    font-size: 11px;
  }
  .attention-btn {
    width: 85px;
    height: 29px;
  }
  .markdown-body {
    padding: 14px;
    background-color: #fff;
  }
  ul {
    list-style: unset;
  }
}
</style>
