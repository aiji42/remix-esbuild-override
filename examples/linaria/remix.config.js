const { withEsbuildOverride } = require("remix-esbuild-override");
const linaria = require("./linaria-esbuild-plugin");

withEsbuildOverride((option) => {
  option.plugins.unshift(linaria({}));

  return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: "cloudflare-workers",
  server: "./server.js",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: [".*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
