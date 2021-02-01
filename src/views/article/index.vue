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
    <div class="content-warp">
      <h1 class="title">{{ article.title }}</h1>
      <!-- 文章作者信息 -->
      <van-cell center>
        <van-image
          class="avatar"
          slot="icon"
          width="35"
          height="35"
          round
          fit="cover"
          :src="article.aut_photo"
        />
        <div class="author-name" slot="title">{{ article.aut_name }}</div>
        <div class="updata-time" slot="label">{{ article.pubdate }}</div>
        <van-button
          @click="onFollow"
          class="attention-btn"
          :type="article.is_followed ? 'default' : 'info'"
          :icon="article.is_followed ? '' : 'plus'"
          size="small"
          round
          :loading="isFollowLoading"
          >{{ article.is_followed ? '已关注' : '关注' }}</van-button
        >
      </van-cell>
      <!-- /文章作者信息 -->
      <!-- 文章内容 -->
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>
      <!-- /文章内容 -->

      <!-- 全部评论 -->
      <comment-list
        :source="articleId"
        :list="commentlist"
        @updata-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      />
      <!-- /全部评论 -->
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button class="btn-writing" @click="isPostShow = true"
        >写评论</van-button
      >
      <van-icon
        color="#777"
        name="comment-o"
        :badge="totalCommentCount"
        class="btn btn-comment"
      />
      <van-icon
        @click="onCollected"
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        :loading="isCollectedLoading"
        class=" btn btn-good"
      />
      <van-icon
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
        class=" btn btn-good"
      />
      <van-icon color="#777" name="share" class=" btn btn-share" />
    </div>
    <!-- /底部区域 -->
    <!-- 发布内容 -->
    <van-popup v-model="isPostShow" position="bottom">
      <post-comment
        :target="articleId"
        @post-success="onPostSuccess"
      ></post-comment>
    </van-popup>
    <!-- /发布内容 -->

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <!-- 这里的 v-if 的目的是让组件随着弹出层的显示进行渲染和销毁，防止加载过的组件不重新渲染和销毁， 防止加载
      过的组件不重新渲染，导致数据不会重新加载的问题 -->
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow = false"
      ></comment-reply>
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import './githubStyle.css'
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '../../api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '../../api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

// 传递文章id的两种方式
// 方式一： 通过 $router.params.articleId
// 方式二： 通过 props传参 （推荐）
export default {
  name: 'ArticleIndex',
  data() {
    return {
      // 文章详情数据
      article: {},
      // 点击以后 请求期间禁用按钮
      isFollowLoading: false,
      // 点击收藏文章
      isCollectedLoading: false,
      // 显示与隐藏评论框
      isPostShow: false,
      // 文章的评论列表
      commentlist: [],
      // 评论的总数量
      totalCommentCount: 0,
      // 评论回复显示与隐藏
      isReplyShow: false,
      // 当前回复评论对象
      replyComment: {}
    }
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  components: {
    CommentList,
    PostComment,
    CommentReply
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
      this.article = res.data

      // 数据改变影响视图更新的 DOM 数据 （不是立即的）
      // 如果我们需要在修改数据之后马上操作改数据影响的视图
      // DOM 需要把这个代码放在 $nextTick 中

      // this.$nextTick 是vue中提供的一个方法
      // 参考文档： https://cn.vuejs.org/v2/api/#vm-nextTick

      // 先调用$nextTick
      this.$nextTick(function() {
        this.handleimagePreview()
      })
    },
    // 图片预览事件业务处理
    handleimagePreview() {
      // 1. 获取文章中内容的 DOM 容器
      const articleContent = this.$refs['article-content']
      console.log(articleContent)
      // 2. 得到所有的img标签
      const imgs = articleContent.querySelectorAll('img')
      console.log(imgs)
      // 3. 循环img列表 给img注册点击事件
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function() {
          // 4. 在事件处理函数中调用 ImagePreview() 预览
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    // 关注（取消关注）用户业务处理
    async onFollow() {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      console.log(this.article.aut_id)
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已关注，取消关注
        this.article.is_followed = false
        await deleteFollow(this.article.aut_id)
      } else {
        // 没有关注，添加关注
        this.article.is_followed = true
        await addFollow(this.article.aut_id)
      }
      // this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    // 收藏（取消收藏）文章的业务
    async onCollected() {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      // 发送请求
      this.isCollectedLoading = true
      if (this.article.is_collected) {
        // 已收藏，取消收藏
        // this.article.is_followed = false
        await deleteCollect(this.articleId)
      } else {
        // 没有收藏，添加收藏
        // this.article.is_followed = true
        await addCollect(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      this.isCollectedLoading = false
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    // 点赞（取消点赞）文章的业务
    async onLike() {
      console.log(this.articleId)
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      // 发送请求
      // this.isCollectedLoading = true
      if (this.article.attitude === 1) {
        // 已点赞，取消点赞
        // this.article.is_followed = false
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        // 没有点赞，添加点赞
        // this.article.is_followed = true
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      // this.article.is_collected = !this.article.is_collected
      // this.isCollectedLoading = false
      this.$toast.success(
        `${this.article.attitude === 1 ? '' : '取消'}点赞成功`
      )
    },
    // 显示评论
    onPostSuccess(comment) {
      // 把发布成功的评论数据对象放在评论列表的顶部
      // console.log(comment)
      this.commentlist.unshift(comment)
      console.log(this.commentlist)
      // 更新评论的总数量
      this.totalCommentCount++
      // 关闭发布评论的弹出层
      this.isPostShow = false
    },
    onReplyClick(comment) {
      console.log('onReplyClick', comment)
      this.replyComment = comment
      // 显示回复评论对话框
      this.isReplyShow = true
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
.article-bottom {
  padding: 0 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 44px;
  background-color: #fff;
  .btn-writing {
    width: 142px;
    height: 28px;
    border-radius: 20px;
    margin-right: 10px;
  }
  .btn {
    padding: 0 13px;
    position: relative;
    top: 11px;
  }
}
.content-warp {
  position: fixed;
  top: 46px;
  right: 0;
  left: 0;
  bottom: 44px;
  overflow-y: auto;
}
</style>
