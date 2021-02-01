<template>
  <div class="comment-item">
    <van-cell>
      <van-image
        slot="icon"
        class="avatar"
        fit="cover"
        round
        :src="comment.aut_photo"
      />
      <div slot="title">
        <div class="title-warp">
          <div class="name">{{ comment.aut_name }}</div>
          <div class="like-warp">
            <van-icon
              class="like"
              :class="{
                liked: comment.is_liking
              }"
              :name="comment.is_liking ? 'good-job' : 'good-job-o'"
              @click="onCommentLiked"
            />
            <span class="like-count">{{ comment.like_count }}</span>
          </div>
        </div>
        <div class="content">{{ comment.content }}</div>
        <div>
          <span class="update">{{
            comment.pubdate | datetime('MM-DD hh:mm')
          }}</span>
          <van-button
            @click="$emit('reply-click', comment)"
            class="back-btn"
            size="mini"
            round
            ><span>{{ comment.reply_count }}</span
            >&nbsp;&nbsp;回复</van-button
          >
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '../../../api/comment'
export default {
  name: 'CommentItem',
  data() {
    return {}
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 点赞事件的处理业务
    async onCommentLiked() {
      // console.log('123')
      const commentId = this.comment.com_id.toString()
      if (this.comment.is_liking) {
        // 已点赞，取消点赞
        await deleteCommentLike(commentId)
        this.comment.like_count--
      } else {
        // 未点赞，点赞
        await addCommentLike(commentId)
        this.comment.like_count++
      }
      // 更新视图
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style scoped lang="less">
.avatar {
  width: 36px;
  height: 36px;
  margin-right: 12px;
}
.title-warp {
  display: flex;
  justify-content: space-between;
}
.name {
  font-size: 14px;
  color: #406599;
}
.content {
  font-size: 16px;
  color: #222222;
  margin: 4px 0;
}
.update {
  font-size: 10px;
  color: #222222;
  margin-right: 8px;
}
.back-btn {
  position: relative;
  bottom: 4px;
}
.like-warp {
  display: flex;
  justify-content: center;
  align-items: center;
}
.liked {
  color: hotpink;
}
</style>
