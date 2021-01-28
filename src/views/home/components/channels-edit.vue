<template>
  <div class="channels-edit">
    <!-- 我的频道 -->
    <van-cell center :border="false">
      <div slot="title" class="channels-title">我的频道</div>
      <van-button
        class="channels-btn"
        type="info"
        @click="isEdit = !isEdit"
        size="mini"
        plain
        round
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item van-ellipsis"
        :class="{ active: index === active }"
        v-for="(item, index) in userChannels"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        :key="index"
        :text="item.name"
        @click="onUserChannelsClick(item, index)"
      />
    </van-grid>
    <!-- /我的频道 -->

    <!-- 频道推荐 -->
    <van-cell center :border="false">
      <div slot="title" class="channels-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item van-ellipsis"
        v-for="channel in recommendChannels"
        :key="channel.id"
        :text="channel.name"
        @click="addChannels(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import {
  getChannels,
  addUserChannel,
  deleteUserChannel
} from '../../../api/channels.js'
import { mapState } from 'vuex'
import { setItem, getItem } from '../../../utils/storage.js'

export default {
  name: 'ChannelsEdit',
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 所有的列表
      allChannels: [],
      // 控制按钮点击
      isEdit: false
    }
  },
  created() {
    this.loadingChannels()
    this.loaclchannels()
    // console.log(getItem('user-channels'))
    // console.log(window.localStorage.getItem('user-channels'))
    // this.userChannels = window.localStorage.getItem('user-channels')
  },
  mounted() {},
  computed: {
    ...mapState(['user']),
    // 计算推荐列表数量
    // 思路： 所有频道 - 我的频道 = 剩下的推荐频道
    // filter 方法： 过滤器，根据方法 返回布尔值 true 用来手机数据
    // filter 方法 查找满足条件的所有元素
    recommendChannels() {
      return this.allChannels.filter(channels => {
        // 判断 channels 是否属于用户频道
        // find方法用来查找满足条件的单个元素
        return !this.userChannels.find(userChannel => {
          // 找到满足该条件的元素
          return userChannel.id === channels.id
        })
      })
    }
  },
  methods: {
    async loadingChannels() {
      const { data: res } = await getChannels()
      console.log(res)
      this.allChannels = res.data.channels
      console.log(this.allChannels)
    },
    loaclchannels() {
      if (!this.user) {
        this.loaclData = getItem('user-channels')
      }
      // console.log(this.loaclData)
      // console.log(getItem('user-channels'))
    },
    // 添加到我的频道事件
    async addChannels(channel) {
      this.userChannels.push(channel)
      console.log(channel.id)
      console.log(this.userChannels.length)

      // 数据持久化
      if (this.user) {
        // 登录了 数据存储在线上
        await addUserChannel({
          channels: [{ id: channel.id, seq: this.userChannels.length }]
        })
      } else {
        // 没有登录 数据存储在本地
        setItem('user-channels', this.userChannels)
        // this.userChannels = window.localStorage.getItem('user-channels')
      }
    },
    // 修改按钮事件
    onUserChannelsClick(item, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态 删除 模块
        this.deleteChannels(item, index)
      } else {
        // 非删除状态 跳转到当前模块
        this.switchChannels(index)
      }
    },
    // 删除模块
    async deleteChannels(item, index) {
      console.log('删除模块')
      // 处理优化删除时索引问题
      if (index <= this.active) {
        this.$emit('updata-channel', this.active - 1)
      }
      // 删除模块的业务
      this.userChannels.splice(index, 1)

      // 数据持久化
      if (this.user) {
        // 登录后，将数据保持到线上
        await deleteUserChannel(item.id)
      } else {
        // 未登录，将数据保持到本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 跳转模块
    switchChannels(index) {
      console.log('跳转模块')
      // 切换到对应的模块
      this.$emit('updata-channel', index)

      // 关闭掉现在的弹框
      this.$emit('closed')
    }
  }
}
</script>

<style scoped lang="less">
.channels-edit {
  padding-top: 54px;
  .channels-title {
    font-size: 16px;
    color: #333;
  }
  .channels-btn {
    border: 1px solid #f96565;
    color: #f96565;
    margin-bottom: 5px;
    padding: 0 10px;
  }
  .grid-item {
    position: relative;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      width: 80px;
      height: 43px;
      // border-radius: 4px;
      .van-grid-item__text {
        font-size: 16px;
        color: #222;
        margin-top: 0;
      }
      .van-icon {
        font-size: 16px;
        position: absolute;
        top: -5px;
        right: -5px;
        color: #ccc;
      }
    }
  }
  /deep/ .van-ellipsis {
    overflow: inherit;
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
