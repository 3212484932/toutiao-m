<template>
  <div class="updata-name">
    <van-nav-bar
      title="个人昵称"
      left-text="返回"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />

    <!-- 修改内容 -->
    <div class="user-warp">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入留言"
        show-word-limit
      />
    </div>
    <!-- /修改内容 -->
    <!-- <button @click="$emit('updata:gender', 0)">修改 gender</button> -->
  </div>
</template>

<script>
import { updataUserProfile } from '../../../api/user'

export default {
  name: 'UpdataName',
  data() {
    return {
      localName: this.value
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
    // gender: {
    //   type: Number
    // }
  },
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        // 调用接口 发送请求 修改用户数据
        const { data: res } = await updataUserProfile({
          name: this.localName
        })

        this.$toast.success('保存成功')
        // 更新成功 -> 修改父组件name —> 关闭弹出层
        this.$emit('input', this.localName)
        this.$emit('close')
        console.log(res)
        this.localName = res.data.name
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-warp {
  padding: 10px;
}
</style>
