const { withEsbuildOverride } = require("remix-esbuild-override");
const vanillaExtractPlugin = require("./vanilla-extract-esbuild-plugin");

withEsbuildOverride((option) => {
  option.plugins.unshift(vanillaExtractPlugin());

  return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
 module.exports = {
  ignoredRouteFiles: [".*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
