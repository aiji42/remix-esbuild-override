# Remix with [remix-validated-form](https://www.remix-validated-form.io/) on Cloudflare

This example is for Cloudflare Workers, but it is basically the same for Cloudflare Pages.

The [remix-validated-form](https://www.remix-validated-form.io/) uses `jotai` internally and it's esm module does not work on Cloudflare because it uses `import.meta`.  
Remix will give preference to esm references in building the server code if you have chosen cloudflare. This works well in most cases, but unfortunately is incompatible with `jotai`.

## Use remix-esbuild-override

Use `remix-esbuild-override` and `esbuild-plugin-alias` to avoid this problem.

1. Install and setup `postinstall`

```bash
npm install -D remix-esbuild-override esbuild-plugin-alias
# or
yarn add -D remix-esbuild-override esbuild-plugin-alias
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

Use [wrangler](https://developers.cloudflare.com/workers/cli-wrangler) to build and deploy your application to Cloudflare Workers. If you don't have it yet, follow [the installation guide](https://developers.cloudflare.com/workers/cli-wrangler/install-update) to get it setup. Be sure to [authenticate the CLI](https://developers.cloudflare.com/workers/cli-wrangler/authentication) as well.

If you don't already have an account, then [create a cloudflare account here](https://dash.cloudflare.com/sign-up) and after verifying your email address with Cloudflare, go to your dashboard and set up your free custom Cloudflare Workers subdomain.

Once that's done, you should be able to deploy your app:

```sh
npm run deploy
```
