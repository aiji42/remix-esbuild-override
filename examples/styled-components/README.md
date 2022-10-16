# Remix with [Styled-Components](https://styled-components.com/)

## Use remix-esbuild-override

To use Styled-Components, the esbuild plugin must be adapted, so install `remix-esbuild-override` to make esbuild extensible.

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

#### 2. Install Styled-Components

```bash
npm install -S styled-components
# or
yarn add styled-components
```

And if you want types:

```bash
npm install -D @types/styled-components
# or
yarn add -D @types/styled-components
```

#### 3. Create a plugin for esbuild

There is [an unofficial esbuild plugin for Styled-Components](https://gist.github.com/hyrious/4fcc3680e7f9998377c7eab42487791a) reusing the official Babel transformer plugin, [`babel-plugin-styled-components`](https://github.com/styled-components/babel-plugin-styled-components).

Copy [this file](https://github.com/aiji42/remix-esbuild-override/tree/main/examples/styled-components/styled-components.js) and place it in the root of the project (same directory as remix.config.js).

Install dependencies for the plugin above:

```bash
npm install -D @babel/core babel-plugin-styled-components
# or
yarn add -D @babel/core babel-plugin-styled-components
```


#### 4. Update remix.config.js

```js
const { withEsbuildOverride } = require("remix-esbuild-override");
const styledComponentsPlugin = require("./styled-components-esbuild-plugin");

withEsbuildOverride((option) => {
  option.plugins.unshift(styledComponentsPlugin());

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

#### 5. Use Styled as normal

You can now create styles with Styled-Components as normal as you get all the benefits of server-side rendered stylesheets including perfect hydration and named styles while in debug-mode:

```ts
import styled from 'styled-components';

const Heading = styled.h1`
  color: hotpink;
`;

export default function Index() {
  return <Heading>Welcome to Remix using Styled-Components</Heading>;
}
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
