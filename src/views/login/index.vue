<template>
  <div class="login-container">
    <!-- 登录头部 -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /登录头部 -->

    <!-- 登录表单 -->
    <van-cell-group>
      <!-- 表单验证 -->
      <!--
        基于vant的表单验证：
      1. 使用van-from 组件包括所有的表单项 van-field
      2. 使用van-from 表单绑定 submit事件
         当表单提交是时候会触发 submit事件
         提示： 只有表单验证通过，他不会调用submit事件
      3. 使用 field中的rules属性定义校验规则
       -->
      <van-form
        :show-error-message="false"
        :show-error="false"
        validate-first
        ref="login-from"
        @submit="onLogin"
        @failed="onFiled"
      >
        <van-field
          v-model="user.mobile"
          icon-prefix="icon"
          left-icon="shouji"
          name="mobile"
          placeholder="请输入手机号"
          :rules="fromRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          name="code"
          icon-prefix="icon"
          left-icon="yanzhengma"
          placeholder="请输入验证码"
          :rules="fromRules.code"
        >
          <template #button>
            <!-- 发送验证码倒计时 -->
            <van-count-down
              center
              :time="isTime"
              format="ss s"
              v-if="isCountDownShow"
              @finish="isCountDownShow = false"
            />
            <van-button
              class="send-btn"
              size="small"
              round
              center
              @click.prevent="onSendSms"
              v-else
              :loading="isSendSmsLoading"
              >发送验证码</van-button
            >
          </template>
        </van-field>
        <div class="login-btn-warp">
          <van-button class="login-btn" type="info" block>登录</van-button>
        </div>
      </van-form>
    </van-cell-group>

    <div class="tip_warp">
      <span class="tip">万能登录手机号：13955555555</span>
      <span class="tip">万能登录验证码：246810</span>
    </div>
    <!-- /登录表单 -->
    <div class="footer">
      <a href="#" class="footer_text">隐私条约</a>
    </div>
  </div>
</template>

<script>
import { login, sendSms } from '../../api/user.js'

// 加载toast轻提示
// import { Toast } from 'vant'

export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      // 登录请求信息
      user: {
        mobile: '13955555555', // 手机号
        code: '246810' // 验证码
      },
      // 校验登录手机号验证码的规则
      fromRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      // 倒计时时间控制
      isTime: 60 * 1000,
      // 控制倒计时显示与隐藏
      isCountDownShow: false,
      // 发送验证码以后使按钮处于加载状态
      isSendSmsLoading: false
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 请求登录事件函数
    async onLogin() {
      // 登录的状态提示
      // 提示的另一种方法
      // this.$toast.loadingo()
      // Toast.loading({
      this.$toast.loading({
        message: '登录中...', // 提示文字
        forbidClick: true, // 在提示时是否禁止页面所有按钮的点击事件
        duration: 0 // 展示时长 值为0 toast不会消失
      })
      // 1. 找到数据接口
      // 2. 封装请求方法
      // 3. 请求调用登录
      try {
        const { data } = await login(this.user)
        // 4. 处理响应结果
        console.log(data)
        // Toast.success('登录成功')
        this.$toast.success('登录成功')
        // 保存token等数据
        this.$store.commit('setUser', data.data)
        // 跳回到原来页面
        this.$router.back()
      } catch (err) {
        // console.l、og(err)
        // console.log('登陆失败', err)
        // Toast.fail('登录失败，手机号或验证码错误')
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    // 验证不通过事件
    onFiled(err) {
      // console.log('验证失败', err)
      if (err.errors[0]) {
        this.$toast({
          message: err.errors[0].message,
          position: 'top'
        })
      }
    },
    // 验证码发送的事件
    async onSendSms() {
      try {
        await this.$refs['login-from'].validate('mobile')
        // 将按钮 loading 状态打开
        this.isSendSmsLoading = true
        // 请求通过发送验证码
        const { data } = await sendSms(this.user.mobile)
        console.log(data)

        // 发送请求成功 显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        // try里面任何代码错误都会进入catch
        // 不同的错误需要不同的提示
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信的错误提示
          message = '发送太频繁，请稍后再试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          message = '发送失败，请稍后重试'
        }
        // 请求失败提示错误信息
        this.$toast({
          message,
          position: 'top'
        })
        console.log(err)
      }
      this.isSendSmsLoading = false
      // 这是一个 异步函数 可以通过 .then .catch 方法判断正确失败 但是上边的方法更加的高效
      // this.$refs['login-from'].validate('mobile').then(valid => {})
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .van-count-down {
    line-height: 34px;
    height: 34px;
  }
  .van-cell-group {
    background-color: #f5f7f9;
  }
  .van-field {
    border-bottom: 1px solid #eee;
  }
  .login-btn-warp {
    padding: 26px 16px;
    .login-btn {
      border-radius: 2px;
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
  .send-btn {
    background-color: #ededed !important;
    .van-button__content {
      .van-button__text {
        font-size: 12px;
        color: #666666;
      }
    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 20px;
    display: block;
    text-align: center;
    .footer_text {
      font-size: 12px;
      color: #666666;
      font-weight: 500;
    }
  }
  .tip_warp {
    margin: 20px 10px;
    .tip {
      font-size: 14px;
      display: block;
    }
  }
}
</style>
