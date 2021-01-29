<template>
  <div class="search-index">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        round
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
        background="#3296fa"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @search="onSearch"
      @updata-searchHistories="searchHistories = $event"
    />
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '../../utils/storage'
// import { getSearchHostories } from '../../api/search'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  data() {
    return {
      // 搜索的内容
      searchText: '',
      // 控制搜索结果的显示与隐藏
      isResultShow: false,
      // 搜索历史列表
      searchHistories: getItem('search-histories') || []
    }
  },
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.localSearchHistories()
  },
  mounted() {},
  watch: {
    // 监听搜索历史数组改变事件
    searchHistories() {
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    // 触发搜索事件
    onSearch(searchText) {
      // console.log('onSearch')
      this.searchText = searchText

      // 处理搜索历史重复的逻辑
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 表示有数据重复 把重复项删除
        this.searchHistories.splice(index, 1)
      }

      // 保存搜索历史记录的业务
      // 把最新的数据保存到 searchHistories 中
      this.searchHistories.unshift(this.searchText)

      // 如果用户已登录，则把搜索历史记录储存到线上
      //   提示： 只要我们调用获取搜索结果的数据接口，后端会给我们自动储存用户的搜索历史记录
      // 如果没有登录，则把搜索历史记录储存到本地

      // 将数据储存到本地
      // setItem('search-histories', this.searchHistories)
      // 显示搜索结果
      this.isResultShow = true
    },
    async localSearchHistories() {
      // 因为后端给我们的储存的历史记录数据太少了（只有四条）
      // 所以我们这里让后端返回的历史记录和本地的历史记录合并到一起

      // 获取本地储存
      const localHistories = getItem('search-histories') || []
      console.log(localHistories)

      // 如果用户登录，利用接口请求数据
      // if (this.user) {
      //   const { data: res } = await getSearchHostories()
      //   console.log(res.data.keywords)
      //   // 数组去重的 set 方法
      //   // 合并数组 [...数组1, ...数组2]
      //   // 把set 转化为数组 [...new Set()]
      //   // 数组的去重 [...new Set([...数组, ...数组])]
      //   localHistories = [...new Set([...localHistories, ...res.data.keywords])]
      // }
      this.searchHistories = localHistories
    }
    // 取消按钮事件
    // onCancel() {
    //   console.log('onCancel')
    // }
  }
}
</script>

<style scoped lang="less"></style>
