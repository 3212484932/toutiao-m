// postcss 的项目适配文件
// postCSS 是基于node.js 运行的一个处理 CSS 工具
// 所以它的配置文件也是运行在 node.js 中

// postCSS 配置文件需要导入一个对象
module.exports = {
  // 配置要使用的相关插件
  plugins: {
    //     // 自动添加浏览器厂商的声明前缀，用于兼容不同的浏览器
    //     // 在vueCLI中已经默认配置了 autoprefixer
    //     autoprefixer: {
    //       // browsers 用来配置要兼容到的浏览器（系统）环境
    //       // 这个配置没有问题 但是写在这里控制台会编译报错
    //       // 因为在 .browserslistrc 文件中已经默认配置了浏览器的兼容
    //       browsers: ['Android >= 4.0', 'iOS >= 8']
    //     },
    // 把 px 转化为 rem
    'postcss-pxtorem': {
      // 转化的根元素基准值
      // 正常情况下按照设计稿来
      // 750的宽度  750 / 10 = 375
      // 移动端的设计页面一般都是以 iphone6 7 8 作为原型来设计的
      // vant 组件库也是基于逻辑像素375 写的
      // 设计稿都是基于物理像素 750 设计的
      // 所以在设计页面的时候 我们就需要在测量的像素的基础上除以 2
      // 或者我们也可以 改变像素单位 为 点
      rootValue: 37.5,
      // 需要转化的CSS 属性， * 就是指所有的属性都需要转换
      propList: ['*']
    }
  }
}