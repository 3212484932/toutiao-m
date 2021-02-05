<template>
  <div class="updata-photo">
    <img :src="image" ref="image" class="image" />
    <van-nav-bar
      right-text="确认"
      left-text="取消"
      class="toolbar"
      @click-right="onConfirm"
      @click-left="$emit('close')"
    />
  </div>
</template>

<script>
import { updataUserPhoto } from '../../../api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'UpdataPhoto',
  data() {
    return {
      // 图片路径
      image: window.URL.createObjectURL(this.file),
      // 裁切器示例
      cropper: null
    }
  },
  props: {
    // 因为传递的对象 不是普通的数据对象 因此 不去规定 type 的属性
    file: {
      required: true
    }
  },
  created() {},
  mounted() {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      //   aspectRatio: 16 / 9,
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
      crop(event) {}
    })
    // console.log(cropper)
  },
  methods: {
    getCroppedCanvas() {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob(blob => {
          resolve(blob)
        })
      })
    },
    async onConfirm() {
      // 操作提示
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0 // 展示事件为 0 持续展示
      })
      // console.log('confirm')
      // 请求接口 修改用户头像
      // 提示： 如果要求的是 Content-Type是 multipart/form-data 则一定要提交 FormData 数据对象 专门用于文件上传
      // 不能提交 {} 没用
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)

      //   const fd = new FormData()
      //   fd.append('photo', this.file)
      await updataUserPhoto(fd)
      // 更新父组件中的用户对象
      this.$emit('updata-photo', window.URL.createObjectURL(file))

      //   console.log(this.image)
      // 关闭弹出层
      this.$emit('close')
      // 更新成功提示
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang="less">
.toolbar {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
}
/* Ensure the size of the image fit the container perfectly */
.image {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
