<template>
  <div class="user-profile">
    <!-- 导航 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航 -->
    <!-- 个人信息详情 -->
    <!-- accept 属性 用于指定选择文件的类型 image 是 图片
      参考文档：https://www.w3school.com.cn/tags/att_input_accept.asp
     -->
    <input
      type="file"
      accept="image/*"
      hidden
      ref="file"
      @change="onFileChange"
    />
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image width="30" height="30" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isEditNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isEditGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isEditBirthdayShow = true"
    ></van-cell>
    <!-- /个人信息详情 -->

    <!-- 修改昵称 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!--
      当你传递给这个子组件的数据 既要使用 又要修改 例如这里的name
      这种情况下 我们可以使用 v-model 简写
     -->
      <!--
       v-model="user.name"
       :value="user.name" 默认名字叫 value
       默认监听 input 事件
      -->
      <!--
        v-model 只能使用一次
        如果多个数据需要保持同步 使用 .sync 修饰符
        :gender="user.gender"
        @updata-gender="user.gender = $event"

        :gender.sync="user.gender"
          :gender="user.gender"
          @updata:gender="user.gender = $event"
          @updata:属性名称="user.gender = $event"
       -->
      <updata-name
        v-if="isEditNameShow"
        v-model="user.name"
        :gender.sync="user.gender"
        @close="isEditNameShow = false"
      />
    </van-popup>
    <!-- /修改昵称 -->

    <!-- 修改性别 -->
    <van-popup v-model="isEditGenderShow" position="bottom">
      <updata-gender @close="isEditGenderShow = false" v-model="user.gender" />
    </van-popup>
    <!-- /修改性别 -->

    <!-- 修改生日 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom">
      <updata-birthday
        v-if="isEditBirthdayShow"
        v-model="user.birthday"
        @close="isEditBirthdayShow = false"
      />
    </van-popup>
    <!-- /修改生日 -->
    <!-- 修改头像 -->
    <van-popup v-model="isEditImageShow" position="bottom" style="height: 100%">
      <updata-photo
        v-if="isEditImageShow"
        :file="previewImage"
        @close="isEditImageShow = false"
        @updata-photo="user.photo = $event"
      />
    </van-popup>
    <!-- /修改头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '../../api/user'
import UpdataName from './components/updata-name'
import UpdataGender from './components/updata-gender'
import UpdataBirthday from './components/updata-birthday'
import UpdataPhoto from './components/updata-photo'
export default {
  name: 'UserProfile',
  data() {
    return {
      // 保存用户个人资料信息
      user: {},
      // 控制显示和隐藏修改昵称
      isEditNameShow: false,
      // 控制显示和隐藏修改性别
      isEditGenderShow: false,
      // 控制显示和隐藏修改生日
      isEditBirthdayShow: false,
      // 控制显示和隐藏修改头像
      isEditImageShow: false,
      // 上传预览图片
      previewImage: null
    }
  },
  components: {
    UpdataName,
    UpdataGender,
    UpdataBirthday,
    UpdataPhoto
  },
  created() {
    this.loadingUserProfile()
  },
  mounted() {},
  methods: {
    async loadingUserProfile() {
      // 发起请求
      const { data: res } = await getUserProfile()

      console.log(res)
      this.user = res.data
    },
    onFileChange() {
      // console.log('onFileChange')
      // 展开弹出层
      this.isEditImageShow = true
      // 在弹出层里面预览图片
      // const blob = window.URL.createObjectURL(this.$refs.file.files[0])
      const file = this.$refs.file.files[0]
      // console.log(blob)
      this.previewImage = file
      // 为了解决相同文件不触发 onFileChange 事件
      // 所以在这里手动清空 file 的 value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.van-popup {
  background-color: #f5f7f9;
}
/deep/ .van-popup--bottom {
  background-color: #000;
}
</style>
