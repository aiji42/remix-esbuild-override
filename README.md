[![npm version](https://badge.fury.io/js/remix-esbuild-override.svg)](https://badge.fury.io/js/remix-esbuild-override)
[![codecov](https://codecov.io/gh/aiji42/remix-esbuild-override/branch/main/graph/badge.svg?token=3CKLRN020Q)](https://codecov.io/gh/aiji42/remix-esbuild-override)

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

```bash
# npm
npm install -D remix-esbuild-override

# yarn
yarn add -D remix-esbuild-override
```

2. Add `remix-esbuild-override` to `scripts.postinstall` in package.json.

```json
"scripts": {
  "postinstall": "remix-esbuild-override"
}
```

3. Run `npm install` or `yarn install` again to run `postinstall`

## How to use

You can define function properties in `remix.config.js` that can override esbuild configuration values.

```js
// remix.config.js
const { withEsbuildOverride } = require("remix-esbuild-override");

/**
 * Define callbacks for the arguments of withEsbuildOverride.
 * @param option - Default configuration values defined by the remix compiler
 * @param isServer - True for server compilation, false for browser compilation
 * @param isDev - True during development.
 * @return {EsbuildOption} - You must return the updated option
 */
withEsbuildOverride((option, { isServer, isDev }) => {
  // update the option
  option.plugins = [someEsbuildPlugin, ...option.plugins];

  return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  // ...
};
```

:memo: NOTE: Compilation is executed twice, once for the server and once for the browser.

### Examples

- [emotion on Cloudflare](https://github.com/aiji42/remix-esbuild-override/tree/main/examples/emotion-cloudflare)
- [Chakra UI on Cloudflare](https://github.com/aiji42/remix-esbuild-override/tree/main/examples/chakra-ui-cloudflare)
- [Styled componets](https://github.com/aiji42/remix-esbuild-override/tree/main/examples/styled-components)

If you have other example requests, please create an issue. Additional pull requests for examples are also welcome.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/aiji42/remix-esbuild-override/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/aiji42/remix-esbuild-override/blob/main/LICENSE) file for details
