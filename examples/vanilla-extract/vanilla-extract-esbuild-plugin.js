const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const {
  compile,
  processVanillaFile,
  cssFileFilter,
  serializeCss,
  virtualCssFileFilter,
  deserializeCss,
} = require("@vanilla-extract/integration");
const css = require("@parcel/css");
const browserslist = require('browserslist');

const nodeModulesRegex = /^(?:.*[\\/])?node_modules(?:[\\/].*)?$/;

const vanillaCssNamespace = "vanilla-extract-css-ns";
const vanillaJSNamespace = "vanilla-extract-js-ns";

function vanillaExtractPlugin() {
  return {
    name: "vanilla-extract-plugin",
    setup(build) {
      const hashLookup = new Map();
      const cssImports = new Map();

      const jsLookup = new Map();
      const cssLookup = new Map();

      /**
       * Find the generated css files and give them a valid css filename and register the
       * source in a lookup which can be accessed when we load the asset
       *
       * Vanilla-extract gives back a filename which contains query params with
       * wich we can communicate between different loaders and resolvers in esbuild;
       */
      build.onResolve({ filter: virtualCssFileFilter }, (args) => {
        // Parse import path
        const match =
          args.path.match(/^(?<fileName>.*)\?source=(?<source>.*)$/) ?? [];

        if (!match.groups) {
          return;
        }

        // Read the filename and source
        const { fileName, source } = match.groups;

        // Register the filename with the correct source so we can deserialize when
        // loading this file, filename is a file path which is generated based on the
        // orginal file and the working directory
        cssLookup.set(fileName, source);

        return {
          path: fileName,
          namespace: vanillaCssNamespace,
        };
      });

      /**
       * We need to convert the generated file to a proper file in esbuild
       * so remix can interpret it as a valid css import
       */
      build.onLoad(
        { filter: /.*/, namespace: vanillaCssNamespace },
        async (args) => {
          // CSS is hashed and should be hased to plain text to be used
          const source = await deserializeCss(cssLookup.get(args.path));

          const { code } = css.transform({
            filename: path.basename(args.path),
            code: Buffer.from(source),
            minify: build.initialOptions.minify,
            sourceMap: false,
            targets: css.browserslistToTargets(browserslist('>= 0.25%')),  
          });

          return {
            contents: code,
            loader: "file",
            resolveDir: path.basename(args.path),
          };
        }
      );

      /**
       * Try to find all vanilla-extract imports and process them in the resolver,
       * we do this in the resolver because in this way we are certain we're finished
       * before the onLoad callback's are called.
       */
      build.onResolve({ filter: /\.css$/ }, async (args) => {
        const result = await build.resolve(args.path + ".ts", {
          resolveDir: args.resolveDir,
        });

        if (result.errors.length > 0) {
          return;
        }

        const { source, watchFiles } = await compile({
          filePath: result.path,
          cwd: build.initialOptions.absWorkingDir,
        });

        const contents = await processVanillaFile({
          source,
          filePath: result.path,
          // We overide the serializeVirtualCssPath and return empty strings
          // so we can use the import paths of the css files in generated
          // file which exports the __vanillaStyle variable
          serializeVirtualCssPath: async (file) => {
            const { fileName, source } = file;

            const serializedCss = await serializeCss(source);

            const importUrl = `${fileName}?source=${serializedCss}`;

            cssImports.set(
              args.importer,
              cssImports.get(args.importer).add(importUrl)
            );

            return "";
          },
          identOption: build.initialOptions.minify ? "short" : "debug",
        });

        // Write the output to the JS lookup variable
        jsLookup.set(result.path, {
          contents,
          watchFiles,
        });

        return {
          path: result.path,
          namespace: "vanilla-css",
        };
      });

      /**
       * Return the compiled file which has been processed in the resolver
       */
      build.onLoad(
        { filter: cssFileFilter, namespace: "vanilla-css" },
        async (args) => {
          const { contents, watchFiles } = jsLookup.get(args.path);

          return {
            contents,
            loader: "js",
            watchFiles,
            resolveDir: path.dirname(args.path),
          };
        }
      );

      /**
       * Catch all created custom vanilla imports and pass them to their own nampespace
       * in which we generate the css imports
       */
      build.onResolve({ filter: /\.vanilla\.js$/ }, (args) => {
        return {
          namespace: vanillaJSNamespace,
          path: args.path,
        };
      });

      /**
       * Read all info of the vanilla-extract files which are imported in
       * the file in which the hash has been initialized and export
       * the compiled css files as an array of variables.
       */
      build.onLoad({ filter: /.*/, namespace: vanillaJSNamespace }, (args) => {
        const match = /(?<hash>\w+)\.vanilla\.js$/.exec(args.path);

        if (match.groups?.hash) {
          // Figure out which files has created this import and get the
          // related css imports for it
          const file = hashLookup.get(match.groups?.hash);

          const cssFiles = cssImports.get(file) ?? new Set();

          const imports = {};

          let i = 0;

          for (let cssFile of cssFiles) {
            imports[`_${i}`] = cssFile;

            i++;
          }

          return {
            contents: `
            ${Object.entries(imports)
              .map(([v, path]) => `import ${v} from '${path}';`)
              .join("\n")}
            export default [${Object.keys(imports).join(", ")}];
          `,
            loader: "js",
            resolveDir: path.basename(args.path),
          };
        }
      });

      /**
       * Read all js / ts related files which are processed by esbuild
       * and append a custom vanilla import to it which exposes the
       * __vanillaStyle variable which can be used to initialize the right
       * links related to the component.
       */
      build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, async (args) => {
        const { ext } = path.parse(args.path);
        const loader = ext.replace(/^\./, "");

        if (nodeModulesRegex.test(args.path)) {
          return {
            loader,
          };
        }

        const rawCode = fs.readFileSync(args.path, "utf8");

        // Create a md5 hash based on the file path which can be used as a
        // query argument to communicate the origin file through the loader
        const hash = crypto.createHash("md5").update(args.path).digest("hex");

        hashLookup.set(hash, args.path);

        // Create a new list of css imports which can be filled when processing the
        // vanilla-extract files
        cssImports.set(args.path, new Set());

        return {
          contents: `
          import __vanillaStyle from '${hash}.vanilla.js';
          ${rawCode}
          `,
          loader,
          resolveDir: path.dirname(args.path),
        };
      });
    },
  };
}

module.exports = vanillaExtractPlugin;
