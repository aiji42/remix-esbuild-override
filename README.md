[![npm version](https://badge.fury.io/js/remix-esbuild-override.svg)](https://badge.fury.io/js/remix-esbuild-override)

# :minidisc: remix-esbuild-override

:warning: While I believe you will most likely get a lot of benefit from using this library, it can sometimes destroy your product.
Please be sure to verify it and make sure it is safe before releasing it to production.

## What is this?

This is a library that makes it possible to change the configuration values of the [Remix](https://remix.run/) compiler (esbuild).

For example, Next.js allows you to control webpack option values from a configuration file (`next.config.js`).
Remix does not have that functionality. A member of the development team says in a [PR comment](https://github.com/remix-run/remix/pull/2168#issuecomment-1058193715) that this is because exposing the configuration values would lock in the compiler's choices and also risk breaking the application.
I support that argument, but in actual use cases, I often want to change the settings.
So I decided to provide that functionality outside of Remix (in this 3rd-party library).

## Install

1. Install `remix-esbuild-override`

```bash
# npm
npm install -D remix-esbuild-override

# yarn 
yarn add -D remix-esbuild-override
```

2. Add `remix-esbuild-override` to `scripts.postinstall` in package.json.

```json
"scripts": {
  "postinstall": "yarn remix setup cloudflare-workers && yarn remix-esbuild-override"
}
```
This is an example if Cloudflare Workers is selected as the runtime for Remix; it should be written to run after `remix setup`.

3. Run `npm install` or `yarn install` again to run `postinstall`

:memo: MEMO: When you run `remix-esbuild-override`, the esbuild in node_modules is replaced by an alias; when resolving the esbuild in the Reimx compiler script, it is not the original esbuild but this library's proxy script is called. Your configuration values are then added and the original esbuild is called.

## How to use

You can define function properties in `remix.config.js` that can override esbuild configuration values.

```js
// remix.config.js

/**
 * @type {import('remix-esbuild-override').AppConfig}
 */
module.exports = {
  serverBuildTarget: "cloudflare-workers",
  // ...,

  /**
   * @param option - Default configuration values defined by the remix compiler
   * @param isServer - True for server compilation, false for browser compilation
   * @param isDev - True during development.
   * @return {EsbuildOption} - You must return the updated option
   */
  esbuildOverride: (option, { isServer, isDev }) => {
    // update the option
    option.plugins = [
      someEsbuildPlugin,
      ...option.plugins
    ]

    return option;
  },
};
```

:memo: NOTE: Compilation is executed twice, once for the server and once for the browser.

### For example

This is an example of choosing Cloudflare Workers at runtime and using [emotion](https://emotion.sh/docs/introduction).

```bash
yarn add @emotion/server @emotion/react @emotion/cache
yarn add -D no-op esbuild-plugin-alias 
```

```ts
// reactShims.ts
import { jsx } from "@emotion/react";
import * as React from "react";
export { jsx, React };
```

```js
// remix.config.js
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
};
```

## If `postinstall` fails

If you are building a project in a monorepo such as `yarn workspace`, esbuild replacement in `postinstall` may fail.  
Update the scripts in package.json so that the `remix-esbuild-override` is executed before the `remix build` is run.

```diff
   "scripts": {
     "postinstall": "yarn remix setup cloudflare-workers",
-    "build": "cross-env NODE_ENV=production remix build",
+    "build": "yarn yarn remix-esbuild-override && yarn cross-env NODE_ENV=production remix build",
     "dev:remix": "cross-env NODE_ENV=development remix watch",
     "dev:miniflare": "cross-env NODE_ENV=development miniflare ./build/index.js --watch",
-    "dev": "cross-env NODE_ENV=development remix build && run-p dev:*",
+    "dev": "yarn yarn remix-esbuild-override && cross-env NODE_ENV=development remix build && run-p dev:*",
     "start": "cross-env NODE_ENV=production miniflare ./build/index.js",
     "deploy": "npm run build && wrangler publish"
   },
```