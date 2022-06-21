# Remix with [vanilla-extract](https://vanilla-extract.style/)

## Use remix-esbuild-override

To use vanilla-extract, the esbuild plugin must be adapted, so install `remix-esbuild-override` to make esbuild extensible.

#### 1. Install and setup `postinstall`

```bash
npm install -D remix-esbuild-override
# or
yarn add -D remix-esbuild-override
```

Update `scripts > postinstall` in package.json.

```json
"scripts": {
  "postinstall": "remix-esbuild-override"
}
```

**Run `npm install` or `yarn install` again to run `postinstall`.**

#### 2. Install vanilla-extract

```bash
npm install @vanilla-extract/css
# or
yarn add @@vanilla-extract/css
```

#### 3. Create a plugin for esbuild and .d.ts

There is an official esbuild plugin for vanilla-extract, but it cannot be used with remix without modification, so you will need to create your own plugin.  
Copy [this file](https://github.com/aiji42/remix-esbuild-override/tree/main/examples/linaria/vanilla-extract-esbuild-plugin.js) and place it in the root of the project (same directory as remix.config.js).

Create `global.d.ts`.

```ts
declare const __vanillaStyle: string[];
```

#### 4. Update remix.config.js

```js
const { withEsbuildOverride } = require("remix-esbuild-override");
const vanillaExtract = require("./vanilla-extract-esbuild-plugin");

withEsbuildOverride((option) => {
  option.plugins.unshift(vanillaExtract());

  return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: [".*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
};
```

#### 5. Use *.css.ts files to define styles

Styles in vanilla-extract should be written in their own files which can be converted to a css file in esbuild. A css file can output multiple css dependencies which can be accessed in the `__vanillaStyle` namespace. Those href's can be passed to the remix run links.

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
