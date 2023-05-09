const { withEsbuildOverride } = require("remix-esbuild-override");
const path = require("path");

withEsbuildOverride((option) => {
  option.inject = [path.resolve(__dirname, "inject.js")];
  return option;
});

const main = async () => {
  await require("esbuild").build({
    entryPoints: ["app.jsx"],
    bundle: true,
    minify: true,
    outfile: "out.js",
  });

  const res = await require("esbuild").context({
    entryPoints: ["app.jsx"],
    bundle: true,
    minify: true,
    outfile: "out.js",
  });
  await res.dispose();
};

main().catch(() => process.exit(1));
