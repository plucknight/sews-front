const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",
    port: 8081,
    // client: {
    //   overlay: false,
    // },
  },
  // chainWebpack: config => {
  // 	config.plugin('provide').use(
  //     [
  //       "import",
  //       {
  //         "libraryName": "view-ui-plus",
  //         "libraryDirectory": "src/components"
  //       },
  //       "view-ui-plus"
  //     ]
  //   );
  // }
});
