const path = require("path");
const fs = require("fs");
const { slugify, transform } = require("@linaria/babel-preset");
const { transformSync } = require("esbuild");

const nodeModulesRegex = /^(?:.*[\\/])?node_modules(?:[\\/].*)?$/;

function linaria({ sourceMap, preprocessor, esbuildOptions, ...rest } = {}) {
  return {
    name: "linaria",
    setup(build) {
      const cssLookup = new Map();

      build.onResolve({ filter: /\.linaria\.css$/ }, (args) => {
        return {
          namespace: "linaria",
          path: args.path,
        };
      });

      build.onLoad({ filter: /.*/, namespace: "linaria" }, (args) => {
        return {
          contents: cssLookup.get(args.path),
          loader: "file",
          resolveDir: path.basename(args.path),
        };
      });

      build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, (args) => {
        const rawCode = fs.readFileSync(args.path, "utf8");
        const { ext, name: filename } = path.parse(args.path);
        const loader = ext.replace(/^\./, "");

        if (nodeModulesRegex.test(args.path)) {
          return {
            loader,
            contents: rawCode,
          };
        }

        if (typeof esbuildOptions === "undefined") {
          esbuildOptions = {};
          if ("jsxFactory" in build.initialOptions) {
            esbuildOptions.jsxFactory = build.initialOptions.jsxFactory;
          }
          if ("jsxFragment" in build.initialOptions) {
            esbuildOptions.jsxFragment = build.initialOptions.jsxFragment;
          }
        }

        const { code } = transformSync(rawCode, {
          ...esbuildOptions,
          loader,
        });
        const result = transform(code, {
          filename: args.path,
          preprocessor,
          pluginOptions: rest,
        });

        if (!result.cssText) {
          return {
            contents: code,
            loader,
            resolveDir: path.dirname(args.path),
          };
        }

        let { cssText } = result;

        const slug = slugify(cssText);
        const cssFilename = `${filename}_${slug}.linaria.css`;

        if (sourceMap && result.cssSourceMapText) {
          const map = Buffer.from(result.cssSourceMapText).toString("base64");
          cssText += `/*# sourceMappingURL=data:application/json;base64,${map}*/`;
        }

        cssLookup.set(cssFilename, cssText);

        return {
          contents: `
          import __linariaStyle from ${JSON.stringify(cssFilename)};
          ${result.code}
          `,
          loader,
          resolveDir: path.dirname(args.path),
        };
      });
    },
  };
}

module.exports = linaria;
