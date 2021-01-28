/**
 * 频道列表请求文件
 */
import request from '../utils/request.js'

/**
 * 获取所有列表请求
 */
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

/**
 * 提交修改的用户请求
 */
export const addUserChannel = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data
  })
}

/**
 * 提交修改的用户请求
 */
export const deleteUserChannel = channelId => {
  return request({
    method: 'PATCH',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
