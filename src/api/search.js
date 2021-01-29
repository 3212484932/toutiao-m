/**
 * 搜索相关的请求
 */

import request from '../utils/request.js'

/**
 * 获取搜索联想建议请求
 * @param {搜索联想词} data
 */
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取搜索的结果
 */
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}

/**
 * 获取搜索的历史记录的请求
 */
export const getSearchHostories = () => {
  return request({
    methods: 'GET',
    url: '/app/v1_0/search/histories'
  })
}
