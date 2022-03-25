import { spawn } from "node:child_process";
import { renameSync, symlinkSync, mkdirSync } from "node:fs";
import { resolvePath } from "./utils";

const esbuildOverrideMainPath = "remix-esbuild-override/dist/index.js";

export const replaceEsbuild = (restartable = true) => {
  const isOverridden = resolvePath("esbuild").endsWith(esbuildOverrideMainPath);
  if (isOverridden) {
    console.log(
      "💽 esbuild has already been replaced. Your custom config can be used to build for Remix"
    );
  } else {
    const [originalEsbuildPath] =
      resolvePath("esbuild").match(/^.*\/esbuild/) ?? [];
    const [esbuildOverridePath] =
      resolvePath("remix-esbuild-override").match(
        /^.*\/remix-esbuild-override/
      ) ?? [];

    const replacedOriginalEsbuildPath = originalEsbuildPath.replace(
      /esbuild$/,
      "esbuild-org"
    );

    renameSync(originalEsbuildPath, replacedOriginalEsbuildPath);
    symlinkSync(esbuildOverridePath, originalEsbuildPath);
    mkdirSync(`${esbuildOverridePath}/bin`);
    symlinkSync(
      `${replacedOriginalEsbuildPath}/bin/esbuild`,
      `${esbuildOverridePath}/bin/esbuild`
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
