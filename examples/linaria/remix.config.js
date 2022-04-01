const { withEsbuildOverride } = require("remix-esbuild-override");
const { default: linaria } = require("@linaria/esbuild");

withEsbuildOverride((option, { isServer }) => {
  if (isServer) option.mainFields = ["browser", "module", "main"];
  option.plugins = [linaria({}), ...option.plugins];

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
