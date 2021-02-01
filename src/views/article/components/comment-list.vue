<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell>评论</van-cell>
      <!-- <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.content"
      /> -->
      <comment-item
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComment } from '../../../api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      // 获取下一页数据的页码
      offset: null,
      // 每页几条数据
      limit: 10
    }
  },
  props: {
    // 如果获取文章的评论，则传递文章的ID
    // 如果获取评论的回复，则传递评论的ID
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 获取文章的评论，使用字符 a
    // 获取评论回复，使用字符 c
    type: {
      type: String,
      default: 'a'
    },
    list: {
      type: Array,
      // 数组和对象的默认值必须通过函数返回
      // default: function() {
      //   return []
      // }
      // 简写
      default: () => []
    }
  },
  components: {
    CommentItem
  },
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      console.log(this.source)
      // 1. 请求获取数据
      const { data: res } = await getComment({
        type: this.type,
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit
      })
      console.log(res)
      this.$emit('updata-total-count', res.data.total_count)
      // 2. 把数据放到列表中
      const { results } = res.data
      console.log(this.list)
      this.list.push(...results)
      // 3. 将本次 loading 关闭
      this.loading = false
      // 4. 判断是否还有数据
      if (results.length) {
        //    如果有 获取更新下一页数据的页码
        this.offset = res.data.last_id
      } else {
        //    如果没有  将finished 设置为 true 不再加载数据
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
