<template>
  <!-- 当前接口已经失效 -->
  <div class="user-chat">
    <!-- 导航 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航 -->
    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="message-list">
      <van-cell
        :title="item.msg"
        v-for="(item, index) in message"
        :key="index"
      />
    </van-cell-group>
    <!-- /消息列表 -->

    <!-- 输入框 -->
    <van-cell-group class="send-message-warp">
      <van-field v-model="message" placeholder="请输入消息" :border="false" />
      <van-button size="small" type="primary" @click="onSend">发送</van-button>
    </van-cell-group>
    <!-- /输入框 -->
  </div>
</template>

<script>
// import io from 'socket.io-client'
import { getItem, setItem } from '../../utils/storage'

// 发送消息
// socket.emit('消息类型', 消息内容)
// socket.on('消息类型', function(data) {
//   data消息
// })
export default {
  name: 'UserChat',
  data() {
    return {
      // 输入框的内容
      message: '',
      //  webSocket 通信对象
      socket: null,
      // 接收到的消息对象
      messages: getItem('chat-messages') || []
    }
  },
  created() {
    // // 建立连接
    // const socket = io('http://ttapi.research.itcast.cn')
    // // 使用
    // // 连接建立成功
    // socket.on('connect', function() {
    //   console.log('连接建立成功')
    // })
    // // 接收到某个事件
    // // socket.on('event', () => {})
    // // 断开连接
    // socket.on('disconnect', () => {
    //   console.log('连接断开了')
    // })
    // socket.on('message', (data) => {
    //   console.log(data)
    // 把对方发给我的消息放在数组中
    // this.massage.push(data)
    // })
    // window.socket = socket
  },
  mounted() {
    this.scrollToBottom()
  },
  watch: {
    // 监视消息记录 保存到本地
    messages() {
      setItem('chat-messages', this.messages)
      // 数据的改变形象视图更新这件事不是立即的
      this.$nextTick(() => {
        // 函数： 使聊天记录页面始终显示最底部消息
        this.scrollToBottom()
      })
    }
  },
  methods: {
    // 发送信息处理事件
    onSend() {
      // 请求发送信息
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      console.log(data)
      //   this.socket.emit('message', {
      //     msg: this.message,
      //     timestamp: Date.now()
      //   })
      this.socket.emit('message', data)
      // 把用户发送的消息储存到数组中
      this.message.push(data)
      // 清空输入框
      this.message = ''
    },
    // 处理发送消息后页面滚动到最底部事件 重要
    scrollToBottom() {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
.send-message-warp {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  padding: 0 14px;
  align-items: center;
  .van-cell {
    width: 85%;
  }
  .van-button--small {
    width: 65px;
  }
}
.message-list {
  position: fixed;
  right: 0;
  left: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
</style>
