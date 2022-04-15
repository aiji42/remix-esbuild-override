const { withEsbuildOverride } = require("remix-esbuild-override");
const alias = require("esbuild-plugin-alias");
const GlobalsPolyfills =
  require("@esbuild-plugins/node-globals-polyfill").default;

withEsbuildOverride((option, { isServer }) => {
  option.plugins = [
    alias({
      "@prisma/client": require.resolve("@prisma/client"),
    }),
    GlobalsPolyfills(),
    ...option.plugins,
  ];

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
