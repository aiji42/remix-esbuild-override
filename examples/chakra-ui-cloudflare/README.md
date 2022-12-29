# Remix with [Chakra UI](https://chakra-ui.com/) on Cloudflare

The base template is based on the official [setup document](https://chakra-ui.com/guides/getting-started/remix-guide) and is exactly as it is under the app directory.  
This example is for Cloudflare Workers, but it is basically the same for Cloudflare Pages.

Since @emotion/server depends on Buffer, it cannot run on Cloudflare as is.

## Use remix-esbuild-override

Use remix-esbuild-override and the plugin for polyfill to solve the problem.

1. Install and setup `postinstall`

```bash
npm install -D remix-esbuild-override @esbuild-plugins/node-globals-polyfill
# or
yarn add -D remix-esbuild-override @esbuild-plugins/node-globals-polyfill
```

Update `scripts > postinstall` in package.json.

```json
"scripts": {
  "postinstall": "remix-esbuild-override"
}
```

**Run `npm install` or `yarn install` again to run `postinstall`.**

2. Update remix.config.js

```js
const { withEsbuildOverride } = require("remix-esbuild-override");
const GlobalsPolyfills =
  require("@esbuild-plugins/node-globals-polyfill").default;

withEsbuildOverride((option, { isServer }) => {
  if (isServer)
    option.plugins = [
      GlobalsPolyfills({
        buffer: true,
      }),
      ...option.plugins,
    ];

  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "cloudflare-workers",
  server: "./server.js",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
```

That's all.

---

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

You will be running two processes during development:

- The Miniflare server (miniflare is a local environment for Cloudflare Workers)
- The Remix development server

Both are started with one command:

```sh
npm run dev
```

Open up [http://127.0.0.1:8787](http://127.0.0.1:8787) and you should be ready to go!

If you want to check the production build, you can stop the dev server and run following commands:

```sh
npm run build
npm start
```

Then refresh the same URL in your browser (no live reload for production builds).

## Deployment

If you don't already have an account, then [create a cloudflare account here](https://dash.cloudflare.com/sign-up) and after verifying your email address with Cloudflare, go to your dashboard and set up your free custom Cloudflare Workers subdomain.

Once that's done, you should be able to deploy your app:

```sh
npm run deploy
```
