<template>
  <!-- <div class="article-item">
    文章列表组件
  </div> -->
  <van-cell
    class="article-item"
    :to="{
      name: 'article',
      params: {
        articleId: article.art_id
      }
    }"
  >
    <div slot="title" class="title van-multi-ellipsis--l3">
      {{ article.title }}
    </div>
    <div slot="label">
      <div class="cover-warp" v-if="article.cover.type >= 2">
        <div
          class="cover-warp-item"
          v-for="(item, index) in article.cover.images"
          :key="index"
        >
          <van-image width="116" height="73" fit="cover" :src="item" />
        </div>
      </div>
      <div class="label-warp">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <div class="default" v-if="article.cover.type">
      <van-image
        v-if="article.cover.type === 1"
        class="image-right"
        fit="cover"
        :src="article.cover.images[0]"
      />
    </div>
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  data() {
    return {}
  },
  computed: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.article-item {
  position: relative;
  /deep/ .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
  }
  .title {
    font-size: 16px;
    color: #3a3a3a;
    font-weight: 500;
  }
  .image-right {
    width: 116px;
    height: 73px;
  }
  .cover-warp {
    padding: 15px 0;
    display: flex;
    .cover-warp-item {
      flex: 1;
      &:not(:last-child) {
        padding-right: 4px;
      }
    }
  }
  .label-warp {
    font-size: 11px;
    color: #b4b4b4;
    margin-top: 20px;
  }
  .label-warp span {
    margin-right: 12px;
  }
}
</style>
