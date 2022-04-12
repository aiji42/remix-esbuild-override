const { withEsbuildOverride } = require("remix-esbuild-override");
const alias = require("esbuild-plugin-alias");

withEsbuildOverride((option, { isServer }) => {
  if (isServer) {
    option.plugins = [
      alias({
        jotai: require.resolve("jotai"),
      }),
      ...option.plugins,
    ];
  }

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
