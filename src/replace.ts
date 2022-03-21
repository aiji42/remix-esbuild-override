import node_child_process_1, { execSync, spawn } from "node:child_process";

export const replaceEsbuild = (restartable = true) => {
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

    const replacedOriginalEsbuildPath = originalEsbuildPath.replace(
      /esbuild$/,
      "esbuild-org"
    );
    execSync(`mv ${originalEsbuildPath} ${replacedOriginalEsbuildPath}`);

    execSync(`ln -s ${linkedEsbuildPath} ${originalEsbuildPath}`);
    execSync(
      `mkdir ${linkedEsbuildPath}/bin && ln -s ${replacedOriginalEsbuildPath}/bin/esbuild ${linkedEsbuildPath}/bin/esbuild`
    );

    console.log(
      "💽 Replaced esbuild. Your custom config can be used to build for Remix"
    );

    if (restartable) restartOnce();
  }
};

const restartOnce = () => {
  if (process.env.restarting)
    throw new Error("An unexpected error has occurred.");

  console.log("💽 Auto restarting precess...");
  spawn(process.argv[0], process.argv.slice(1), {
    env: { restarting: "true" },
    stdio: "ignore",
  }).unref();
};
