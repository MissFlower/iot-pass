module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  devServer: {
    // open: true,
    host: "0.0.0.0",
    port: 8091,
    https: false,
    hotOnly: false,
    proxy: null
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= 'IOT管理系统'
        return args
      })
    // 一个规则里的 基础Loader
    // svg是个基础loader
    const svgRule = config.module.rule("svg");
    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();
    // 添加要替换的 loader
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
  }
  // lintOnSave: false // 取消 eslint 验证
};
