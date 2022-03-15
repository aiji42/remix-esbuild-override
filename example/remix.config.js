const path = require("node:path");
const alias = require("esbuild-plugin-alias");

/**
 * @type {import('remix-esbuild-override').AppConfig}
 */
module.exports = {
  serverBuildTarget: "cloudflare-workers",
  server: "./server.js",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: [".*"],
  esbuildOverride: (option, { isServer }) => {
    option.jsxFactory = "jsx";
    option.inject = [path.resolve(__dirname, "reactShims.ts")];
    option.plugins = [
      alias({
        through: require.resolve("no-op"),
        "html-tokenize": require.resolve("no-op"),
        multipipe: require.resolve("no-op"),
      }),
      ...option.plugins,
    ];
    if (isServer) option.mainFields = ["browser", "module", "main"];

    return option;
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // devServerPort: 8002
};
