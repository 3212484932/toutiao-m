<template>
  <div class="my-container">
    <!-- 我的信息 -->
    <van-cell-group v-if="user" class="my-info">
      <!-- 头像 昵称 -->
      <van-cell class="cell-warp" center :border="false">
        <van-image
          class="avator"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{ currentUser.name }}</div>
        <van-button class="name-info" size="small" round to="/user/profile"
          >编辑资料</van-button
        >
      </van-cell>
      <!-- 信息 -->
      <van-grid :border="false">
        <van-grid-item class="item-info">
          <div class="text-warp" slot="text">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="item-info">
          <div class="text-warp" slot="text">
            <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="item-info">
          <div class="text-warp" slot="text">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="item-info">
          <div class="text-warp" slot="text">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录 -->
    <div
      class="not_login"
      v-else
      @click="
        $router.push({
          name: 'login',
          query: {
            redirect: '/my'
          }
        })
      "
    >
      <img class="mobile" src="./mobile.png" />
      <div class="text">注册 / 登录</div>
    </div>
    <!-- /我的信息 -->
    <!-- 收藏 历史 -->
    <van-grid class="nav-warp" :column-num="2">
      <van-grid-item
        class="nav-warp-item"
        icon-prefix="icon"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-warp-item"
        icon-prefix="icon"
        icon="lishi"
        text="历史"
      />
    </van-grid>
    <!-- /收藏 历史 -->
    <!-- 消息通知 小智同学 退出登录 -->
    <div class="mb-4" style="width: 100%;"></div>
    <van-cell v-if="user" class="sty" title="消息通知" is-link to="" />
    <van-cell class="sty" title="小智同学" is-link to="/user/chat" />
    <van-cell
      v-if="user"
      class="logout mb-4"
      title="退出登录"
      @click="onLogout"
    />
    <!-- /消息通知 小智同学 退出登录 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '../../api/user.js'
export default {
  name: 'myIndex',
  data() {
    return {
      // 保存当前的用户信息
      currentUser: {}
    }
  },
  created() {
    // 请求当前用户数据
    this.getCurrentinfo()
  },
  mounted() {},
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 获取当前用于信息请求
    async getCurrentinfo() {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
      // console.log(data.data)
    },
    // 退出登录的操作事件
    onLogout() {
      // 弹出 dialog 提示框
      // 提示用户确认退出
      // 确认 -> 处理退出
      this.$dialog
        .confirm({
          title: '退出提示',
          message: '确认退出登录吗？'
        })
        .then(() => {
          // 确认的事件处理
          // 清除 当前本地中所保存的 token值
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 取消的事件处理
        })
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .my-info {
    background: url('./banner.png') no-repeat;
    background-size: cover;
  }
  .not_login {
    height: 160px;
    background: url('./banner.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      margin-top: 5px;
      font-size: 14px;
      color: #fff;
    }
  }
  .cell-warp {
    background-color: unset;
    height: 116px;
    padding-top: 39px;
    padding-bottom: 12px;
    .avator {
      width: 66px;
      height: 66px;
      margin-right: 12px;
      border: 1px solid #fff;
    }
    .name {
      color: #fff;
      font-size: 15px;
      margin-top: 5px;
    }
    .name-info {
      height: 20px;
      color: #666;
      font-size: 10px;
    }
  }
  /deep/.van-grid-item__content {
    background-color: unset;
  }
  // 头条 关注 粉丝 。。
  .van-grid {
    .item-info {
      height: 65px;
      color: #fff;
      .text-warp {
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        // align-content: center;
        display: block;
        text-align: center;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 12px;
        }
      }
    }
  }
  // 收藏 历史
  /deep/.nav-warp {
    background-color: #fff;
    .nav-warp-item {
      height: 70px;
      .icon {
        font-size: 22px;
      }
      .icon-shoucang {
        color: #ed6768;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333 !important;
      }
    }
  }
  .logout {
    text-align: center;
    color: #d86262;
    font-size: 15px;
  }
  .sty {
    font-size: 15px;
    color: #333;
  }
  .mb-4 {
    margin-top: 5px;
  }
}
</style>
