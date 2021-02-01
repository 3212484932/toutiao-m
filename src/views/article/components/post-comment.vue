<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      size="mini"
      class="post-btn"
      @click="onPost"
      :disabled="!message"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '../../../api/comment'
export default {
  name: 'PostComment',
  data() {
    return {
      // 文本输入内容
      message: ''
    }
  },
  props: {
    target: {
      type: [String, Number, Object],
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      default: null
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 处理发表评论事件的业务
    async onPost() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true // 禁止点击其他地方
      })
      // 1. 请求接口
      const { data: res } = await addComment({
        target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.message, // 评论内容
        art_id: this.articleId ? this.articleId.toString() : null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })

      // console.log(res)
      this.$emit('post-success', res.data.new_obj)
      // 2. 处理返回数据
      // 3. 隐藏对话框
      this.$toast.success({
        message: '发布成功'
      })
      // 发布成功 清空文本框的内容
      this.message = ''
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  align-items: center;
}
.post-btn {
  width: 50px;
}
</style>
