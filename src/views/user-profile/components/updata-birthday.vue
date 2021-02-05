<template>
  <div class="updata-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updataUserProfile } from '../../../api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdataBirthday',
  data() {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      // console.log('confirm')
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      //   const date = `${this.currentDate.getFullYear()} - ${this.currentDate.getMonth() +
      //     1} - ${this.currentDate.getDate()}`
      // 调用接口 发送请求 修改用户数据
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      const { data: res } = await updataUserProfile({
        birthday: date
      })

      this.$toast.success('保存成功')
      // 更新成功 -> 修改父组件name —> 关闭弹出层
      this.$emit('input', date)
      this.$emit('close')
      console.log(res)
      this.localName = res.data.name
    }
  }
}
</script>

<style scoped lang="less"></style>
