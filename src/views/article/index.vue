<template>
  <div class="article-index">文章详情页</div>
</template>

<script>
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
      type: String,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
