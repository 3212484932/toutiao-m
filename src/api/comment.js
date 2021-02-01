/**
 * 文章的评论部分
 */
import request from '../utils/request.js'

export const getComment = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

/**
 * 对评论或者评论回复的点赞
 * @param {*} params
 */
export const addCommentLike = commentId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

/**
 * 取消对评论和评论回复的点赞
 * @param {*} params
 */
export const deleteCommentLike = commentId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${commentId}`
  })
}

/**
 * 添加评论或者回复
 * @param {*} params
 */
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
