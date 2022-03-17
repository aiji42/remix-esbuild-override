import { execSync, spawn } from "node:child_process";

const replaceEsbuild = (restartable = true) => {
  const isOverridden = require
    .resolve("esbuild")
    .endsWith("remix-esbuild-override/dist/index.js");
  if (isOverridden) {
    console.log(
      "💽 esbuild has already been replaced. Your custom config can be used to build for Remix"
    );
  } else {
    const [originalEsbuildPath] =
      require.resolve("esbuild").match(/^.*\/esbuild/) ?? [];
    const [linkedEsbuildPath] =
      require
        .resolve("remix-esbuild-override")
        .match(/^.*\/remix-esbuild-override/) ?? [];

    execSync(
      `mv ${originalEsbuildPath} ${originalEsbuildPath.replace(
        /esbuild$/,
        "esbuild-org"
      )}`
    );

    execSync(`ln -s ${linkedEsbuildPath} ${originalEsbuildPath}`);

    console.log(
      "💽 Replaced esbuild. Your custom config can be used to build for Remix"
    );

    if (restartable) restartOnce();
  }
};

export default replaceEsbuild;

const restartOnce = () => {
  if (process.env.restarting)
    throw new Error("An unexpected error has occurred.");

  console.log("💽 Auto restarting precess...");
  spawn(process.argv[0], process.argv.slice(1), {
    env: { restarting: "true" },
    stdio: "ignore",
  }).unref();
};
