<template>
  <div class="updata-gender">
    <van-picker
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updataUserProfile } from '../../../api/user'

export default {
  name: 'UpdataGender',
  data() {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    onGenderChange(pricker, value, index) {
      //   console.log(pricker, value, index)
      this.defaultIndex = index
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      // 调用接口 发送请求 修改用户数据
      const { data: res } = await updataUserProfile({
        gender: this.defaultIndex
      })

      this.$toast.success('保存成功')
      // 更新成功 -> 修改父组件name —> 关闭弹出层
      this.$emit('input', this.defaultIndex)
      this.$emit('close')
      console.log(res)
      this.localName = res.data.name
    }
  }
}
</script>

<style scoped lang="less"></style>
