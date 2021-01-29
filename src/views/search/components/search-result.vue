<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '../../../api/search'

export default {
  name: 'SearchResult',
  data() {
    return {
      // 列表加载数据
      list: [],
      loading: false,
      finished: false,
      // 页数
      page: 1,
      // 每页数量
      perPage: 10
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 列表触发事件
    async onLoad() {
      // 1. 请求获取数据
      const { data: res } = await getSearchResult({
        page: this.page,
        per_page: this.perPage,
        q: this.searchText
      })

      // console.log(res)
      // 2. 将数据放在数据列表中
      const { results } = res.data
      this.list.push(...results)
      // 3. 关闭本次loading事件
      this.loading = false
      // 4. 判断是否有数据
      if (results.length) {
        //    如果有，将更新获取下一页数据的页码
        this.page++
      } else {
        //    如果没有，则将finished 设置为 true 关闭加载更多
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-result {
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}
</style>
