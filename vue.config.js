module.exports = {
  devServer: {
    // open: true,
    host: "0.0.0.0",
    port: 8091,
    https: false,
    hotOnly: false,
    // proxy: "http://iot.paas.vaiwan.com" // string | Object
    proxy: {
      "/api": {
        target: "http://iot.paas.vaiwan.com",
        ws: true, //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: {
          //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          "^/api": "/"
        }
      }
    }
  },
  chainWebpack: config => {
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
