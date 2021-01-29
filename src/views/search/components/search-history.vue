<template>
  <div class="search-history">
    <van-cell title="历史记录">
      <div v-if="isDeleteShow">
        <span @click="$emit('updata-searchHistories', [])">清除记录</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete-o" v-else @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onDelete(item, index)"
    >
      <van-icon name="close" v-if="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
// import { setItem } from '../../../utils/storage'
export default {
  name: 'SearchHistory',
  data() {
    return {
      // 控制删除按钮的显示与隐藏
      isDeleteShow: false
    }
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 删除历史记录的业务处理
    onDelete(item, index) {
      // 如果是删除的状态
      if (this.isDeleteShow) {
        // 根据索引 删除对应的
        this.searchHistories.splice(index, 1)

        // setItem('search-histories', this.searchHistories)
        // 数据持久化
        // 1. 修改本地储存的数据
        // 2. 请求接口删除本地数据
        return
      }
      // 如果是非删除状态
      this.$emit('search', item)
    }
  }
}
</script>

<style scoped lang="less"></style>
