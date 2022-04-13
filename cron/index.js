const { withEsbuildOverride } = require("remix-esbuild-override");
const path = require("path");

withEsbuildOverride((option) => {
  option.inject = [path.resolve(__dirname, "inject.js")];
  return option;
});

require("esbuild").build({
  entryPoints: ["app.jsx"],
  bundle: true,
  minify: true,
  outfile: "out.js",
});
