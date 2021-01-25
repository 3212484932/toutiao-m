/**
 * 本地储存的封装模块
 */

// 本地存储的获取
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // 为什么把 JSON.parse 放在try-catch中？
  // 因为data 可能不是 JSON 格式字符串
  try {
    //  尝试将 data 转化为 JavaScript对象
    return JSON.parse(data)
  } catch (err) {
    // 有可能 data 不是 JSON格式的字符串
    return data
  }
}
// 本地存储的保存
export const setItem = (name, value) => {
  // 如果 value 是对象， 就把 value 转化为 JSON 字符串再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}
// 本地存储的删除
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
