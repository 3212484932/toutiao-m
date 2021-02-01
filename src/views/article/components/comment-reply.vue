<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 当前的评论项 -->
    <comment-item :comment="comment" />
    <!-- /当前的评论项 -->
    <!-- 评论的回复 -->
    <van-cell title="全部评论"></van-cell>
    <comment-list
      :source="comment.com_id"
      type="c"
      :list="commentList"
    ></comment-list>
    <!-- /评论的回复 -->
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button class="btn-writing" @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部区域 -->
    <!-- 评论回复 -->
    <van-popup v-model="isPostShow" position="bottom">
      <post-comment
        :target="comment.com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'
export default {
  name: 'CommentReply',
  data() {
    return {
      isPostShow: false,
      // 评论的评论列表
      commentList: []
    }
  },
  props: {
    // 查看回复的评论项
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  created() {},
  mounted() {},
  methods: {
    // 把发布成功的评论放到评论列表的顶部
    onPostSuccess(comment) {
      this.commentList.unshift(comment)
      // 更新评论回复的数量
      this.comment.reply_count++
      // 关闭发布回复的弹出层
      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
.article-bottom {
  padding: 0 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 44px;
  background-color: #fff;
  text-align: center;
  .btn-writing {
    width: 200px;
    height: 30px;
    border-radius: 20px;
    margin-right: 10px;
  }
  .btn {
    padding: 0 13px;
  }
}
</style>
